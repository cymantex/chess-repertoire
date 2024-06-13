import { ChildNode, defaultGame, makePgn, PgnNodeData } from "chessops/pgn";
import { Pgn } from "@/external/chessops/defs.ts";
import { INITIAL_FEN } from "chessops/fen";

export const defaultPgn = (): Pgn => ({
  ...defaultGame(),
  fen: INITIAL_FEN,
});

export const toPgn = (pgn: Pgn) => makePgn(pgn)?.split("\n\n")?.[1] ?? "";

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

export const findNextMove = (pgn: Pgn, previousMoves: string[]) => {
  const currentMove = findCurrentMove(pgn, previousMoves);

  if (currentMove) {
    return currentMove.children[0];
  }
};

export const getRemainingMainMoves = (pgn: Pgn, previousMoves: string[]) => {
  const currentMove = findCurrentMove(
    pgn,
    previousMoves,
  ) as ChildNode<PgnNodeData>;

  if (currentMove) {
    return Array.from(currentMove.mainlineNodes()).map((node) => node.data.san);
  }

  return [];
};

export const findCurrentMove = (pgn: Pgn, previousMoves: string[]) => {
  if (previousMoves.length === 0) {
    return pgn.moves;
  }

  let currentMove: ChildNode<PgnNodeData> | undefined;

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
