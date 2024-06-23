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

interface AnalyseParams {
  fen: string;
  searchTimeInMs: number;
  onAnalysisResult: (result: AnalysisResult) => unknown;
  onError: (error: ErrorEvent) => unknown;
  onBestMove?: (bestMove: BestMove) => unknown;
  onTimeout?: () => unknown;
}

export interface Stockfish {
  setOption: (option: StockfishOption, value: string | number) => Stockfish;
  setPosition: (fen: string) => Stockfish;
  analyse: (params: AnalyseParams) => Stockfish;
  start: () => Promise<void>;
  stop: () => Promise<Stockfish>;
  isStarted: () => boolean;
}

export interface BestMove {
  bestmove: string;
  ponder: string;
}

export const ERROR_STOCKFISH_NOT_STARTED = "Stockfish worker not started";

/**
 * @property {string} threads - The number of CPU threads used for searching
 * a position. For best performance, set this equal to the number of CPU cores available.
 * @property {string} hash - The size of the hash table in MB. It is recommended
 * to set Hash after setting Threads.
 * @property {string} clearHash - Clear the hash table.
 * @property {string} ponder - Let Stockfish ponder its next move while the
 * opponent is thinking.
 * @property {string} multipv - Output the N best lines (principal variations,
 * PVs) when searching. Leave at 1 for best performance.
 * @property {string} useNnue - Toggle between the NNUE and classical evaluation
 * functions. If set to "true", the network parameters must be available to load
 * from file (see also EvalFile), if they are not embedded in the binary.
 * @property {string} evalFile - The name of the file of the NNUE evaluation
 * parameters. Depending on the GUI the filename might have to include the
 * full path to the folder/directory that contains the file. Other locations,
 * such as the directory that contains the binary and the working directory,
 * are also searched.
 * @property {string} uciAnalyseMode - An option handled by your GUI.
 * @property {string} uciChess960 - An option handled by your GUI. If true,
 * Stockfish will play Chess960.
 * @property {string} uciShowWdl - If enabled, show approximate WDL statistics
 * as part of the engine output. These WDL numbers model expected game outcomes
 * for a given evaluation and game ply for engine self-play at fishtest LTC
 * conditions (60+0.6s per game).
 * @property {string} uciLimitStrength - Enable weaker play aiming for an Elo
 * rating as set by UCI_Elo. This option overrides Skill Level.
 * @property {string} uciElo - If enabled by UCI_LimitStrength, aim for an
 * engine strength of the given Elo. This Elo rating has been calibrated at a
 * time control of 60s+0.6s and anchored to CCRL 40/4.
 * @property {string} skillLevel - Lower the Skill Level in order to make
 * Stockfish play weaker (see also UCI_LimitStrength). Internally, MultiPV is
 * enabled, and with a certain probability depending on the Skill Level a
 * weaker move will be played.
 * @property {string} syzygyPath - Path to the folders/directories storing the
 * Syzygy tablebase files. Multiple directories are to be separated by ";" on
 * Windows and by ":" on Unix-based operating systems. Do not use spaces around
 * the ";" or ":".
 * @property {string} syzygyProbeDepth - Minimum remaining search depth for
 * which a position is probed. Set this option to a higher value to probe less
 * aggressively if you experience too much slowdown (in terms of nps) due to
 * tablebase probing.
 * @property {string} syzygy50MoveRule - Disable to let fifty-move rule draws
 * detected by Syzygy tablebase probes count as wins or losses. This is useful
 * for ICCF correspondence games.
 * @property {string} syzygyProbeLimit - Limit Syzygy tablebase probing to
 * positions with at most this many pieces left (including kings and pawns).
 * @property {string} moveOverhead - Assume a time delay of x ms due to network
 * and GUI overheads. This is useful to avoid losses on time in those cases.
 * @property {string} slowMover - Lower values will make Stockfish take less
 * time in games, higher values will make it think longer.
 * @property {string} nodestime - Tells the engine to use nodes searched
 * instead of wall time to account for elapsed time. Useful for engine testing.
 * @property {string} debugLogFile - Write all communication to and from the
 * engine into a text file.
 * @property {string} compiler - Give information about the compiler and
 * environment used for building a binary.
 * @property {string} d - Display the current position, with ascii art and fen.
 * @property {string} eval - Return the evaluation of the current position.
 * @property {string} flip - Flips the side to move.
 */
export const STOCKFISH_OPTIONS = {
  multiPv: "MultiPV",
  threads: "Threads",
  hash: "Hash",
  clearHash: "Clear Hash",
  ponder: "Ponder",
  useNnue: "Use NNUE",
  evalFile: "EvalFile",
  uciAnalyseMode: "UCI_AnalyseMode",
  uciChess960: "UCI_Chess960",
  uciShowWdl: "UCI_ShowWDL",
  uciLimitStrength: "UCI_LimitStrength",
  uciElo: "UCI_Elo",
  skillLevel: "Skill Level",
  syzygyPath: "SyzygyPath",
  syzygyProbeDepth: "SyzygyProbeDepth",
  syzygy50MoveRule: "Syzygy50MoveRule",
  syzygyProbeLimit: "SyzygyProbeLimit",
  moveOverhead: "Move Overhead",
  slowMover: "Slow Mover",
  nodestime: "nodestime",
  debugLogFile: "Debug Log File",
  compiler: "compiler",
  d: "d",
  eval: "eval",
  flip: "flip",
} as const;

export type StockfishOption =
  (typeof STOCKFISH_OPTIONS)[keyof typeof STOCKFISH_OPTIONS];

export const ANALYSIS_STATE = {
  STARTING: "STARTING",
  ANALYSING: "ANALYSING",
  STOPPING: "STOPPING",
  STOPPED: "STOPPED",
} as const;

export type AnalysisState =
  (typeof ANALYSIS_STATE)[keyof typeof ANALYSIS_STATE];

export type MessageSubscriber = (message: string) => void;
export type ErrorSubscriber = (error: ErrorEvent) => void;
