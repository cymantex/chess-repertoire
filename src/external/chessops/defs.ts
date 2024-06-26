import { Game, PgnNodeData } from "chessops/pgn";

export interface Pgn extends Game<PgnNodeData> {}

export interface PgnMoveData {
  san: string;
  fen: string;
  fenBefore: string;
  moveNumber?: string;
}

export interface RenderPgnNodeData extends PgnNodeData, PgnMoveData {}
