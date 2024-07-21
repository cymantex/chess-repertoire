// Requires stockfish-nnue-16.wasm to be publicly available in the web root
// For Vite this means it should be located in the dist/assets folder
import StockfishWorker from "stockfish/src/stockfish-nnue-16.js?worker";
import {
  generateUuid,
  isAnalysisResult,
  parseBestMove,
  parsePartialAnalysisResult,
} from "@/stockfish/utils.ts";
import {
  ERROR_STOCKFISH_NOT_STARTED,
  Stockfish,
  StockfishOption,
} from "@/stockfish/defs.ts";

export const createStockfish = (): Stockfish => {
  let stockfishWorker: Worker | null = null;
  const internalMessageSubscribers = new Map<
    string,
    (message: string) => void
  >();
  const internalErrorSubscribers = new Map<
    string,
    (error: ErrorEvent) => void
  >();
  const externalAnalyseSubscribers = new Set<(message: string) => void>();
  const externalAnalyseErrorSubscribers = new Set<
    (error: ErrorEvent) => void
  >();

  const sendUciMessage = (message: string) => {
    if (!stockfishWorker) {
      throw new Error(ERROR_STOCKFISH_NOT_STARTED);
    }

    stockfishWorker.postMessage(message);
    return stockfish;
  };

  const setOption = (option: StockfishOption, value: string | number) =>
    sendUciMessage(`setoption name ${option} value ${value}`);

  const setPosition = (fen: string) => sendUciMessage(`position fen ${fen}`);

  const waitUntilMessageReceived = (
    sendMessage: () => unknown,
    messageToReceive: string,
    retries = 3,
  ): Promise<unknown> => {
    const subscriberId = generateUuid();

    const clearWaitUntilMessageSubscriptions = () => {
      internalMessageSubscribers.delete(subscriberId);
      internalErrorSubscribers.delete(subscriberId);
    };

    const waitUntilMessagePromise = new Promise<void>((resolve, reject) => {
      const waitUntilMessageSubscriber = (receivedMessage: string) => {
        if (messageToReceive === receivedMessage) {
          clearWaitUntilMessageSubscriptions();
          resolve();
        }
      };

      const rejectOnErrorSubscriber = () => {
        clearWaitUntilMessageSubscriptions();
        reject();
      };

      internalMessageSubscribers.set(subscriberId, waitUntilMessageSubscriber);
      internalErrorSubscribers.set(subscriberId, rejectOnErrorSubscriber);
      sendMessage();
    });

    const timeoutPromise = new Promise<void>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        clearWaitUntilMessageSubscriptions();
        reject(`Timed out waiting to receive message: ${messageToReceive}`);
      }, 3000);
    });

    return Promise.race([waitUntilMessagePromise, timeoutPromise]).catch(
      (error) => {
        if (retries <= 0) {
          throw error;
        }

        return waitUntilMessageReceived(
          sendMessage,
          messageToReceive,
          retries - 1,
        );
      },
    );
  };

  const handleUnexpectedError = (error: unknown, message: string) => {
    clearExternalSubscribers();

    console.error(error);

    if (stockfishWorker) {
      stockfishWorker.terminate();
      stockfishWorker = null;
    }

    throw new Error(message);
  };

  const clearExternalSubscribers = () => {
    externalAnalyseSubscribers.clear();
    externalAnalyseErrorSubscribers.clear();
  };

  const setupStockfishWorker = (logMessages: boolean) => {
    const worker = new StockfishWorker();

    worker!.onmessage = (event) => {
      for (const subscriber of internalMessageSubscribers.values()) {
        subscriber(event.data);
      }
      externalAnalyseSubscribers.forEach((subscriber) =>
        subscriber(event.data),
      );

      if (logMessages) {
        console.log(event.data);
      }
    };
    worker!.onerror = (error) => {
      for (const subscriber of internalErrorSubscribers.values()) {
        subscriber(error);
      }
      externalAnalyseErrorSubscribers.forEach((subscriber) =>
        subscriber(error),
      );

      if (logMessages) {
        console.error(error);
      }
    };
    worker!.onmessageerror = (error) => {
      for (const subscriber of internalErrorSubscribers.values()) {
        subscriber(new ErrorEvent(error.data));
      }
      externalAnalyseErrorSubscribers.forEach((subscriber) =>
        subscriber(new ErrorEvent(error.data)),
      );

      if (logMessages) {
        console.error(error);
      }
    };
    return worker;
  };

  const stockfish: Stockfish = {
    start: async ({ logMessages = false } = { logMessages: false }) => {
      if (!window.crossOriginIsolated) {
        throw new Error(
          "Stockfish requires cross-origin isolation to be enabled.",
        );
      }

      if (stockfishWorker) {
        return;
      }

      const worker = setupStockfishWorker(logMessages);

      try {
        await waitUntilMessageReceived(
          () => worker.postMessage("uci"),
          "uciok",
        );
        await waitUntilMessageReceived(
          () => worker.postMessage("isready"),
          "readyok",
        );
      } catch (error) {
        handleUnexpectedError(
          error,
          "Something went wrong when trying to start Stockfish",
        );
      }

      stockfishWorker = worker;
    },
    stop: () => {
      if (!stockfishWorker) return stockfish;

      clearExternalSubscribers();

      // Other commands should start with an "isready" command to ensure
      // the engine is ready to receive commands. Meaning we don't have to
      // wait for the "stop" command to be processed.
      sendUciMessage("stop");

      return stockfish;
    },
    analyse: async ({
      fen,
      searchTimeInMs,
      onAnalysisResult,
      onError,
      onBestMove,
      onTimeout,
    }) => {
      if (!stockfishWorker) {
        throw new Error(ERROR_STOCKFISH_NOT_STARTED);
      }

      stockfish.stop();

      try {
        await waitUntilMessageReceived(
          () => sendUciMessage("isready"),
          "readyok",
        );
      } catch (error) {
        handleUnexpectedError(
          error,
          "Something went wrong when trying to stop stockfish",
        );
      }

      setPosition(fen);

      try {
        await waitUntilMessageReceived(
          () => sendUciMessage("isready"),
          "readyok",
        );
      } catch (error) {
        handleUnexpectedError(
          error,
          "Something went wrong when trying to analyse the position",
        );
      }

      if (searchTimeInMs === Infinity) {
        sendUciMessage(`go infinite`);
      } else {
        sendUciMessage(`go movetime ${searchTimeInMs}`);

        setTimeout(() => {
          // UCI lacks a way to determine if a search was stopped due to
          // a timeout or manually being stopped with the "stop" command.
          // This is a workaround to determine if a search was stopped due
          // to a timeout.
          onTimeout?.();
        }, searchTimeInMs);
      }

      externalAnalyseSubscribers.add((message) => {
        if (message.startsWith("info")) {
          const partialAnalysisResult = parsePartialAnalysisResult(message);

          if (isAnalysisResult(partialAnalysisResult)) {
            onAnalysisResult(partialAnalysisResult, fen);
          }
        } else if (message.startsWith("bestmove")) {
          onBestMove?.(parseBestMove(message));
        }
      });
      externalAnalyseErrorSubscribers.add(onError);

      return stockfish;
    },
    setOption,
    setPosition,
    isStarted: () => !!stockfishWorker,
  };

  return stockfish;
};
