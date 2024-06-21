// Requires stockfish-nnue-16.wasm to be publicly available in the web root
// For Vite this means it should be located in the dist/assets folder
import StockfishWorker from "stockfish/src/stockfish-nnue-16.js?worker";
import {
  isAnalysisResult,
  parseBestMove,
  parsePartialAnalysisResult,
  waitUntilMessageReceived,
} from "@/stockfish/utils.ts";
import { ERROR_STOCKFISH_NOT_STARTED, Stockfish } from "@/stockfish/defs.ts";

export const createStockfish = (): Stockfish => {
  let stockfishWorker: Worker | null = null;

  const sendUciMessage = (message: string) => {
    if (!stockfishWorker) {
      throw new Error(ERROR_STOCKFISH_NOT_STARTED);
    }

    stockfishWorker.postMessage(message);
    return stockfish;
  };

  const setOption = (name: string, value: string) =>
    sendUciMessage(`setoption name ${name} value ${value}`);

  const setPosition = (fen: string) => sendUciMessage(`position fen ${fen}`);

  const stockfish: Stockfish = {
    start: async () => {
      if (stockfishWorker) {
        return;
      }

      const worker = new StockfishWorker();

      worker.postMessage("uci");
      await waitUntilMessageReceived(worker, "uciok");

      worker.postMessage("isready");
      await waitUntilMessageReceived(worker, "readyok");

      stockfishWorker = worker;
      stockfish.worker = worker;
    },
    stop: async () => {
      if (stockfishWorker) {
        sendUciMessage(`stop`);
      }

      return stockfish;
    },
    analyze: ({
      fen,
      searchTimeInMs,
      onAnalysisResult,
      onError,
      onBestMove,
      onTimeout,
    }) => {
      setPosition(fen);

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

      stockfishWorker!.onmessage = (event) => {
        const message = event.data;

        if (message.startsWith("info")) {
          const analysisResult = parsePartialAnalysisResult(message);

          if (isAnalysisResult(analysisResult)) {
            onAnalysisResult(analysisResult);
          }
        } else if (message.startsWith("bestmove")) {
          onBestMove?.(parseBestMove(message));
        }
      };
      stockfishWorker!.onerror = onError;
      stockfishWorker!.onmessageerror = (error) => {
        onError(new ErrorEvent(error.data));
      };

      return stockfish;
    },
    setOption,
    setPosition,
    setMultipv: (multipv) => setOption("multipv", multipv.toString()),
    setThreads: (threads) => setOption("threads", threads.toString()),
    isStarted: () => !!stockfishWorker,
    worker: stockfishWorker,
  };

  return stockfish;
};
