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

export interface Stockfish {
  setOption: (name: string, value: string) => Stockfish;
  setMultipv: (multipv: number) => Stockfish;
  setThreads: (threads: number) => Stockfish;
  setPosition: (fen: string) => Stockfish;
  analyze: (options: {
    fen: string;
    searchTimeInMs: number;
    onAnalysisResult: (result: AnalysisResult) => unknown;
    onError: (error: ErrorEvent) => unknown;
    onBestMove?: (bestMove: BestMove) => unknown;
    onTimeout?: () => unknown;
  }) => Stockfish;
  start: () => Promise<void>;
  stop: () => Promise<Stockfish>;
  isStarted: () => boolean;
  worker: Worker | null;
}

export interface BestMove {
  bestmove: string;
  ponder: string;
}

export const ERROR_STOCKFISH_NOT_STARTED = "Stockfish worker not started";

export const ANALYSIS_STATE = {
  STARTING: "STARTING",
  ANALYSING: "ANALYSING",
  STOPPING: "STOPPING",
  STOPPED: "STOPPED",
} as const;

export type AnalysisState =
  (typeof ANALYSIS_STATE)[keyof typeof ANALYSIS_STATE];
