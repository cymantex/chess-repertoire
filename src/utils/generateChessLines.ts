// @ts-ignore
import {
  PRIORITY_PGN_COMMENT_PREFIX,
  RepertoireMove,
  RepertoirePosition,
} from "@/defs.ts";
import { Chess } from "chess.js";
import { isNumber } from "lodash";

type GetRepertoirePosition = (
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
  await setCurrentRepertoirePositionComment(chess, getRepertoirePosition);

  for (const san of previousMoves) {
    const priorityComment = await getPriorityCommentForNextMove(
      chess,
      getRepertoirePosition,
      san,
    );
    chess.move(san);
    await setCurrentRepertoirePositionComment(
      chess,
      getRepertoirePosition,
      priorityComment,
    );
  }

  return chess;
};

const makeMove = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
  move: RepertoireMove,
) => {
  const priorityComment = await getPriorityCommentForNextMove(
    chess,
    getRepertoirePosition,
    move.san,
  );
  chess.move(move.san);
  await setCurrentRepertoirePositionComment(
    chess,
    getRepertoirePosition,
    priorityComment,
  );
};

const getPriorityCommentForNextMove = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
  nextSan: string,
) => {
  const repertoirePosition = await getRepertoirePosition(chess.fen());
  const nextMove = repertoirePosition?.moves?.find(
    (move) => move.san === nextSan,
  );

  if (isNumber(nextMove?.priority)) {
    return `${PRIORITY_PGN_COMMENT_PREFIX}${nextMove.priority}`;
  }
};

const setCurrentRepertoirePositionComment = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
  priorityComment?: string,
) => {
  const repertoirePosition = await getRepertoirePosition(chess.fen());
  const comment = repertoirePosition?.comment;

  if (comment) {
    chess.setComment(comment + (priorityComment ?? ""));
  } else if (priorityComment) {
    chess.setComment(priorityComment);
  }
};

const hasMoves = (nextPosition?: RepertoirePosition) =>
  nextPosition &&
  nextPosition?.moves?.length &&
  nextPosition?.moves?.length > 0;
