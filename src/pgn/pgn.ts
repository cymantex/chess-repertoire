import { ChildNode, defaultGame, Node, PgnNodeData } from "chessops/pgn";
import { FEN_STARTING_POSITION } from "@/chessboard/constants.ts";
import { Pgn } from "@/pgn/types.ts";

export const defaultPgn = (): Pgn => ({
  ...defaultGame(),
  fen: FEN_STARTING_POSITION,
});

export const addMoveToPgn = (
  currentPgn: Pgn,
  san: string,
  previousMoves: string[],
) => {
  const currentMove = findCurrentMove(currentPgn, previousMoves);

  if (currentMove) {
    currentMove.children.push(new ChildNode<PgnNodeData>({ san }));
  }
};

export const findCurrentMove = (
  pgn: Pgn,
  previousMoves: string[],
): Node<PgnNodeData> | undefined => {
  if (previousMoves.length === 0) {
    return pgn.moves;
  }

  let currentMove: Node<PgnNodeData> | undefined;

  for (const previousMove of previousMoves) {
    if (currentMove) {
      currentMove = currentMove.children.find(
        (move: ChildNode<PgnNodeData>) => move.data.san === previousMove,
      );
    } else {
      currentMove = pgn.moves.children.find(
        (move) => move.data.san === previousMove,
      );
    }

    if (!currentMove) {
      return;
    }
  }

  return currentMove;
};
