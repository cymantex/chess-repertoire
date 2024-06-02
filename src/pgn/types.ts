import { Game } from "chessops/pgn";

interface PgnNodeData {
  san: string;
  startingComments?: string[];
  comments?: string[];
  nags?: number[];
}

export interface Pgn extends Game<PgnNodeData> {
  fen: string;
}
