import { Chess, Square, SQUARES, WHITE } from "chess.js";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.ts";

export const calcPossibleDestinations = (chess: Chess) => {
  const possibleDestinations = new Map<Square, Square[]>();

  SQUARES.forEach((square) => {
    const moves = chess.moves({ square, verbose: true });
    if (moves.length)
      possibleDestinations.set(
        square,
        moves.map((move) => move.to),
      );
  });

  return possibleDestinations;
};

export const findNextMoveBySan = (chess: Chess, san: string) =>
  chess.moves({ verbose: true }).find((move) => move.san === san);

export const determineTurnColor = (chess: Chess) =>
  chess.turn() === WHITE ? CG_WHITE : CG_BLACK;
