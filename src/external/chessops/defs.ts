import type { PgnNodeData } from "chessops/pgn";
import { INITIAL_FEN } from "chessops/fen";

export interface PgnMoveData {
  san: string;
  fen: string;
  fenBefore: string;
  moveNumber?: string;
}

export interface RenderPgnNodeData extends PgnNodeData, PgnMoveData {}

export const FEN_STARTING_POSITION = INITIAL_FEN;
