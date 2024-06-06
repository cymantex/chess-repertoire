import { BISHOP, KING, KNIGHT, PAWN, QUEEN, ROOK } from "chess.js";

export const CJ_PROMOTION_FLAG = "p";
export const CJ_PIECE_TO_CG_PIECE = {
  [PAWN]: "pawn",
  [KNIGHT]: "knight",
  [BISHOP]: "bishop",
  [ROOK]: "rook",
  [QUEEN]: "queen",
  [KING]: "king",
} as const;
