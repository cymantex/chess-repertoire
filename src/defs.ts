import { Move } from "chess.js";
import {
  WHITE_BISHOP_SVG,
  WHITE_KING_SVG,
  WHITE_PAWN_SVG,
  WHITE_QUEEN_SVG,
  WHITE_ROOK_SVG,
} from "@/external/chessground/defs.tsx";

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

export const PRIORITY_SVG = [
  WHITE_KING_SVG,
  WHITE_QUEEN_SVG,
  WHITE_ROOK_SVG,
  WHITE_BISHOP_SVG,
  WHITE_PAWN_SVG,
] as const;

export const REPERTOIRE_MOVE_PRIORITY = {
  KING: 0,
  QUEEN: 1,
  ROOK: 2,
  BISHOP: 3,
  PAWN: 4,
} as const;

export type RepertoireMovePriority =
  (typeof REPERTOIRE_MOVE_PRIORITY)[keyof typeof REPERTOIRE_MOVE_PRIORITY];

export type Column = keyof typeof COLUMN_NUMBERS;

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
}

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
