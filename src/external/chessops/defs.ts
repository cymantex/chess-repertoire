import { Game, PgnNodeData } from "chessops/pgn";

export interface Pgn extends Game<PgnNodeData> {
  fen: string;
}
