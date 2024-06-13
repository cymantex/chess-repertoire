import { Chess, WHITE } from "chess.js";
import {
  OpeningExplorerMove,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
} from "@/defs.ts";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";

export const toRepertoireOpeningExplorerMoves = (
  chess: Chess,
  moves: (OpeningExplorerMove | RepertoireMove)[],
): RepertoireOpeningExplorerMove[] =>
  moves.map((move) => {
    const nextMove = findNextMoveBySan(chess, move.san);
    return { ...nextMove, ...move } as RepertoireOpeningExplorerMove;
  });

export const determineTurnColor = (chess: Chess) =>
  chess.turn() === WHITE ? CG_WHITE : CG_BLACK;
