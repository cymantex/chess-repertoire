import { Move } from "chess.js";
import {
  WHITE_BISHOP_SVG,
  WHITE_KING_SVG,
  WHITE_PAWN_SVG,
  WHITE_QUEEN_SVG,
  WHITE_ROOK_SVG,
} from "@/external/chessground/defs.tsx";
import { DrawShape } from "chessground/draw";

export const FEN_STARTING_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const COLUMN_NUMBERS = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
} as const;

export type Column = keyof typeof COLUMN_NUMBERS;

// Lichess API
export interface OpeningExplorerMove {
  averageRating: number;
  black: number;
  draws: number;
  san: string;
  white: number;
}

export interface OpeningExplorerResponse {
  black: number;
  draws: number;
  opening: string;
  white: number;
  moves: OpeningExplorerMove[];
}

export interface CloudEvaluationResponse {
  fen: string;
  knodes: number;
  depth: number;
  pvs: {
    moves: string;
    cp: number;
  }[];
}

// Repertoire
export const REPERTOIRE_MOVE_PRIORITY = {
  KING: 0,
  QUEEN: 1,
  ROOK: 2,
  BISHOP: 3,
  PAWN: 4,
} as const;

export const PRIORITY_SVG = [
  WHITE_KING_SVG,
  WHITE_QUEEN_SVG,
  WHITE_ROOK_SVG,
  WHITE_BISHOP_SVG,
  WHITE_PAWN_SVG,
] as const;

export type RepertoireMovePriority =
  (typeof REPERTOIRE_MOVE_PRIORITY)[keyof typeof REPERTOIRE_MOVE_PRIORITY];

export interface PriorityMove extends Move {
  priority?: RepertoireMovePriority;
}

export interface RepertoireMove {
  san: string;
  priority?: RepertoireMovePriority;
}

export interface RepertoirePositionData {
  moves?: RepertoireMove[];
  comment?: string;
  shapes?: DrawShape[];
}

export type RepertoireOpeningExplorerMove =
  | PriorityMove
  | (PriorityMove & OpeningExplorerMove);

// Settings
export const PRIORITY_PGN_COMMENT_PREFIX = "__PRIORITY:";
export const PRIORITY_SETTING_NO_PRIORITY = 1000;
export const PRIORITY_SETTING_DONT_SAVE = 10000;
export const PRIORITY_SETTING = {
  ...REPERTOIRE_MOVE_PRIORITY,
  NO_PRIORITY: PRIORITY_SETTING_NO_PRIORITY,
  DONT_SAVE: PRIORITY_SETTING_DONT_SAVE,
} as const;
export type PrioritySetting =
  (typeof PRIORITY_SETTING)[keyof typeof PRIORITY_SETTING];

export interface RepertoireSettings {
  prioritySetting: PrioritySetting;
}

export const SETTINGS_KEY = "repertoireSettings";
export const DEFAULT_SETTINGS: RepertoireSettings = {
  prioritySetting: REPERTOIRE_MOVE_PRIORITY.KING,
};
export const DEFAULT_POSITION_DATA = { moves: [] };
