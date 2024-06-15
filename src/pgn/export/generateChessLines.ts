// @ts-ignore
import { RepertoirePosition } from "@/defs.ts";
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
  position,
  previousMoves,
  getRepertoirePosition,
}: GenerateChessLinesProps): AsyncGenerator<Chess> {
  if (!position) return;

  for (const move of position.moves!) {
    const chess = await createChess(previousMoves, getRepertoirePosition);
    chess.move(move.san);
    await setCommentIfPresent(chess, getRepertoirePosition);

    const nextPosition = await getRepertoirePosition(chess.fen());

    if (hasMoves(nextPosition)) {
      yield* generateChessLines({
        position: nextPosition!,
        previousMoves: chess.history(),
        getRepertoirePosition,
      });
    } else {
      yield chess;
    }
  }
}

const createChess = async (
  previousMoves: string[],
  getRepertoirePosition: GetRepertoirePosition,
) => {
  const chess = new Chess();
  await setCommentIfPresent(chess, getRepertoirePosition);

  for (const san of previousMoves) {
    chess.move(san);
    await setCommentIfPresent(chess, getRepertoirePosition);
  }

  return chess;
};

const setCommentIfPresent = async (
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
