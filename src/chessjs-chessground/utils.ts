import { Chess, Move, Square, SQUARES } from "chess.js";
import { CJ_PROMOTION_FLAG } from "@/chessjs-chessground/constants.ts";
import { Key } from "chessground/types";

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

export const determineMoveType = ({
  chess,
  from,
  to,
  onPromotionMove,
  onNormalMove,
}: {
  chess: Chess;
  from: Key;
  to: Key;
  onPromotionMove: (move: Move) => void;
  onNormalMove: (move: Move) => void;
}) => {
  const pendingMove = chess
    .moves({ verbose: true })
    .find((move) => move.from === from && move.to === to);

  if (!pendingMove) return;
  if (pendingMove.flags.includes(CJ_PROMOTION_FLAG)) {
    onPromotionMove(pendingMove);
    return;
  }

  onNormalMove(pendingMove);
};
