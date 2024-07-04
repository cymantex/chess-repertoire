// Requires stockfish-nnue-16.wasm to be publicly available in the web root
// For Vite this means it should be located in the dist/assets folder
import StockfishWorker from "stockfish/src/stockfish-nnue-16.js?worker";
import {
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
  const internalMessageSubscribers = new Set<(message: string) => void>();
  const internalErrorSubscribers = new Set<(error: ErrorEvent) => void>();
  const externalMessageSubscribers = new Set<(message: string) => void>();
  const externalErrorSubscribers = new Set<(error: ErrorEvent) => void>();

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
  ) => {
    const promise = new Promise<void>((resolve, reject) => {
      const waitUntilMessageSubscriber = (receivedMessage: string) => {
        if (messageToReceive === receivedMessage) {
          internalMessageSubscribers.delete(waitUntilMessageSubscriber);
          internalErrorSubscribers.delete(rejectOnErrorSubscriber);
          resolve();
        }
      };
      const rejectOnErrorSubscriber = () => {
        internalMessageSubscribers.delete(waitUntilMessageSubscriber);
        internalErrorSubscribers.delete(rejectOnErrorSubscriber);
        reject();
      };

      internalMessageSubscribers.add(waitUntilMessageSubscriber);
      internalErrorSubscribers.add(rejectOnErrorSubscriber);
      sendMessage();
    });

    const timeoutPromise = new Promise<void>((_, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(`Timed out waiting to receive message: ${messageToReceive}`);
      }, 5000);
    });

    return Promise.race([promise, timeoutPromise]);
  };

  const stockfish: Stockfish = {
    start: async (logMessages = false) => {
      if (!window.crossOriginIsolated) {
        throw new Error(
          "Stockfish requires cross-origin isolation to be enabled.",
        );
      }

      if (stockfishWorker) {
        return;
      }

      const worker = new StockfishWorker();

      worker!.onmessage = (event) => {
        internalMessageSubscribers.forEach((subscriber) =>
          subscriber(event.data),
        );
        externalMessageSubscribers.forEach((subscriber) =>
          subscriber(event.data),
        );

        if (logMessages) {
          console.log(event.data);
        }
      };
      worker!.onerror = (error) => {
        internalErrorSubscribers.forEach((subscriber) => subscriber(error));
        externalErrorSubscribers.forEach((subscriber) => subscriber(error));

        if (logMessages) {
          console.error(error);
        }
      };
      worker!.onmessageerror = (error) => {
        externalErrorSubscribers.forEach((subscriber) =>
          subscriber(new ErrorEvent(error.data)),
        );

        if (logMessages) {
          console.error(error);
        }
      };

      await waitUntilMessageReceived(() => worker.postMessage("uci"), "uciok");
      await waitUntilMessageReceived(
        () => worker.postMessage("isready"),
        "readyok",
      );

      stockfishWorker = worker;
    },
    stop: async () => {
      if (stockfishWorker) {
        externalMessageSubscribers.clear();
        externalErrorSubscribers.clear();
        sendUciMessage("stop");
        await waitUntilMessageReceived(
          () => stockfishWorker!.postMessage("isready"),
          "readyok",
        );
      }

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
      setPosition(fen);

      await waitUntilMessageReceived(
        () => stockfishWorker!.postMessage("isready"),
        "readyok",
      );

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

      externalMessageSubscribers.add((message) => {
        if (message.startsWith("info")) {
          const analysisResult = parsePartialAnalysisResult(message);

          if (isAnalysisResult(analysisResult)) {
            onAnalysisResult(analysisResult, fen);
          }
        } else if (message.startsWith("bestmove")) {
          onBestMove?.(parseBestMove(message));
        }
      });
      externalErrorSubscribers.add(onError);

      return stockfish;
    },
    setOption,
    setPosition,
    isStarted: () => !!stockfishWorker,
  };

  return stockfish;
};
