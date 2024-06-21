import StockfishWorker from "stockfish/src/stockfish-nnue-16-single?worker";

const ERROR_STOCKFISH_NOT_STARTED = new Error("Stockfish worker not started");

/**
 * Interface representing the result of a chess position analysis performed by
 * the Stockfish chess engine.
 * @interface
 *
 * @property {number} cp - The "centipawn" value, a measure of the advantage of
 * a position. A value of 100 represents an advantage equivalent to one pawn.
 * @property {number} mate - The number of moves until checkmate. A positive
 * number means the side to move can force a checkmate in that many moves. A
 * negative number means the side to move will be checkmated in that many moves.
 * @property {string[]} pv - The "principal variation", the sequence of best
 * moves found by the engine for both sides. Each string represents a move in
 * Universal Chess Interface (UCI) format.
 * @property {number} multipv - The number of principal variations that the
 * engine has been instructed to find. A value of 1 means the engine only finds
 * the best move, a value of 2 means it finds the two best moves, and so on.
 * @property {number} depth - The depth of the search tree explored by the
 * engine, measured in half-moves (or "plies"). A higher depth means the engine
 * looked further ahead.
 * @property {number} time - The time in milliseconds that the engine spent on
 * the analysis.
 * @property {number} tbhits - The number of times the engine used endgame
 * tablebases during its search. Endgame tablebases are databases of
 * precalculated endgame positions that the engine can use to play perfectly in
 * the endgame.
 * @property {number} seldepth - The maximum depth the engine searched on the
 * current move. It can be greater than depth if the engine searched some lines
 * deeper than others.
 * @property {number} hashfull - A measure of how full the engine's
 * transposition table is. The transposition table is a cache of previously
 * evaluated positions that the engine uses to speed up its search. A value of
 * 1000 means the table is completely full.
 * @property {number} nps - The "nodes per second", a measure of the engine's
 * speed. It's calculated as the total number of nodes evaluated divided by the
 * time spent.
 * @property {number} nodes - The total number of positions the engine evaluated
 * during its search.
 */
export interface AnalysisResult {
  cp?: number;
  mate?: number;
  pv: string[];
  multipv: number;
  depth: number;
  time: number;
  tbhits?: number;
  seldepth: number;
  hashfull: number;
  nps: number;
  nodes: number;
}

export interface BestMove {
  bestmove: string;
  ponder: string;
}

export const createStockfish = () => {
  let stockfishWorker: Worker | null = null;

  const sendUciMessage = (message: string) => {
    if (!stockfishWorker) {
      throw ERROR_STOCKFISH_NOT_STARTED;
    }

    stockfishWorker.postMessage(message);
    return stockfish;
  };

  const setOption = (name: string, value: string) =>
    sendUciMessage(`setoption name ${name} value ${value}`);

  const setMultipv = (multipv: number) =>
    setOption("multipv", multipv.toString());

  const setHash = (memorySizeInMb: number) =>
    setOption("hash", memorySizeInMb.toString());

  const setThreads = (threads: number) =>
    setOption("threads", threads.toString());

  const setPosition = (fen: string) => sendUciMessage(`position fen ${fen}`);

  const analyze = ({
    fen,
    searchTimeInMs,
    onAnalysisResult,
    onError,
    onStop,
  }: {
    fen: string;
    searchTimeInMs: number;
    onAnalysisResult: (result: AnalysisResult) => unknown;
    onStop: (bestMove: BestMove) => unknown;
    onError: (error: ErrorEvent) => unknown;
  }) => {
    setPosition(fen);

    if (searchTimeInMs === Infinity) {
      sendUciMessage(`go infinite`);
    } else {
      sendUciMessage(`go movetime ${searchTimeInMs}`);
    }

    stockfishWorker!.onmessage = (event) => {
      const message = event.data;

      if (message.startsWith("info")) {
        const analysisResult = parseAnalysisResult(message);

        if (
          (analysisResult.pv && analysisResult.pv.length > 1) ||
          analysisResult.mate
        ) {
          onAnalysisResult(analysisResult);
        }
      } else if (message.startsWith("bestmove")) {
        onStop({
          bestmove: message.split(" ")[1],
          ponder: message.split(" ")[3],
        });
      }
    };
    stockfishWorker!.onerror = onError;

    return stockfish;
  };

  const start = async () => {
    if (stockfishWorker) {
      return;
    }

    const worker = new StockfishWorker();
    worker.postMessage("uci");

    await new Promise<void>((resolve, reject) => {
      worker.onmessage = (event) => {
        const message = event.data;

        if (message === "uciok") {
          worker.onmessage = null;
          worker.onmessageerror = console.error;
          worker.onerror = console.error;
          resolve();
        }
      };
      worker.onmessageerror = reject;
      worker.onerror = reject;
    });

    stockfishWorker = worker;
  };

  const stop = () => {
    if (stockfishWorker) {
      sendUciMessage(`stop`);
    }

    return stockfish;
  };

  const stockfish = {
    start,
    stop,
    analyze,
    setOption,
    setMultipv,
    setHash,
    setThreads,
    setPosition,
    worker: stockfishWorker,
  };

  return stockfish;
};

const parseAnalysisResult = (infoMessage: string): AnalysisResult => {
  const analysisResult: Partial<AnalysisResult> = {};

  const parts = infoMessage.split(" ");
  analysisResult.cp = parseMessageInt("cp", parts);
  analysisResult.mate = parseMessageInt("mate", parts);
  analysisResult.depth = parseMessageInt("depth", parts);
  analysisResult.seldepth = parseMessageInt("seldepth", parts);
  analysisResult.tbhits = parseMessageInt("tbhits", parts);
  analysisResult.nodes = parseMessageInt("nodes", parts);
  analysisResult.time = parseMessageInt("time", parts);
  analysisResult.nps = parseMessageInt("nps", parts);
  analysisResult.multipv = parseMessageInt("multipv", parts);
  analysisResult.hashfull = parseMessageInt("hashfull", parts);

  const pvIndex = parts.indexOf("pv");

  if (pvIndex !== -1) {
    analysisResult.pv = parts.slice(pvIndex + 1);
  }

  return analysisResult as AnalysisResult;
};

const parseMessageInt = (
  key: string,
  messageParts: string[],
): number | undefined => {
  const index = messageParts.indexOf(key);

  if (index !== -1) {
    const hashfull = messageParts[index + 1];
    return parseInt(hashfull, 10);
  }

  return undefined;
};
