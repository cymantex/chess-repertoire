import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "chess.js";

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
export const CG_WHITE = "white";
export const CG_BLACK = "black";
export const CJ_PROMOTION_FLAG = "p";
export const CJ_PIECE_TO_CG_PIECE = {
  [PAWN]: "pawn",
  [KNIGHT]: "knight",
  [BISHOP]: "bishop",
  [ROOK]: "rook",
  [QUEEN]: "queen",
  [KING]: "king",
} as const;
