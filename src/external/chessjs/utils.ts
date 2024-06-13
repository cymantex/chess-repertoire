import { Chess, Square, SQUARES } from "chess.js";

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

export const findNextMoves = (chess: Chess, sanList: string[]) =>
  chess.moves({ verbose: true }).filter((move) => sanList.includes(move.san));
