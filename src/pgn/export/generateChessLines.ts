// @ts-ignore
import { RepertoireMove, RepertoirePosition } from "@/defs.ts";
import { Chess } from "chess.js";
import { isNotEmptyArray } from "@/utils/utils.ts";

export type GetRepertoirePosition = (
  fen: string,
) => Promise<RepertoirePosition | undefined>;

interface GenerateChessLinesProps {
  getRepertoirePosition: GetRepertoirePosition;
  position: RepertoirePosition | undefined;
  previousMoves: string[];
}

export async function* generateChessLines({
  getRepertoirePosition,
  position,
  previousMoves,
}: GenerateChessLinesProps): AsyncGenerator<Chess> {
  if (!position) return;

  for (const move of position.moves!) {
    const chess = await createChess(getRepertoirePosition, previousMoves);
    await makeMove(chess, getRepertoirePosition, move);

    const nextPosition = await getRepertoirePosition(chess.fen());

    if (hasMoves(nextPosition)) {
      yield* generateChessLines({
        getRepertoirePosition,
        position: nextPosition!,
        previousMoves: chess.history(),
      });
    } else {
      yield chess;
    }
  }
}

const createChess = async (
  getRepertoirePosition: GetRepertoirePosition,
  previousMoves: string[],
) => {
  const chess = new Chess();
  await setRepertoirePositionHeader(chess, getRepertoirePosition);

  for (const san of previousMoves) {
    await makeMove(chess, getRepertoirePosition, { san });
  }

  return chess;
};

const makeMove = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
  move: RepertoireMove,
) => {
  chess.move(move.san);
  await setRepertoirePositionHeader(chess, getRepertoirePosition);
};

const setRepertoirePositionHeader = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
) => {
  const repertoirePosition = await getRepertoirePosition(chess.fen());
  const comment = repertoirePosition?.comment;

  if (comment) {
    chess.setComment(comment);
  }
};

const hasMoves = (nextPosition?: RepertoirePosition) =>
  nextPosition && isNotEmptyArray(nextPosition.moves);
