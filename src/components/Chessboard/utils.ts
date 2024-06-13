import { Chess, WHITE } from "chess.js";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";

export const determineTurnColor = (chess: Chess) =>
  chess.turn() === WHITE ? CG_WHITE : CG_BLACK;