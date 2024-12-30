import type { Chess} from "chess.js";
import { WHITE } from "chess.js";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";

export const CG_ID = "main-chessboard";

export const determineTurnColor = (chess: Chess) =>
  chess.turn() === WHITE ? CG_WHITE : CG_BLACK;
