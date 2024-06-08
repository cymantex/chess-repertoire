// @ts-ignore
import {
  PRIORITY_PGN_COMMENT_PREFIX,
  RepertoireMove,
  RepertoirePositionData,
} from "@/defs.ts";
import { Chess } from "chess.js";
import { isNumber } from "lodash";

type GetRepertoirePositionData = (
  fen: string,
) => Promise<RepertoirePositionData | undefined>;

interface GenerateChessLinesProps {
  getRepertoirePositionData: GetRepertoirePositionData;
  position: RepertoirePositionData | undefined;
  previousMoves: string[];
}

export async function* generateChessLines({
  getRepertoirePositionData,
  position,
  previousMoves,
}: GenerateChessLinesProps): AsyncGenerator<Chess> {
  if (!position) return;

  for (const move of position.moves!) {
    const chess = await createChess(getRepertoirePositionData, previousMoves);
    await makeMove(chess, getRepertoirePositionData, move);

    const nextPosition = await getRepertoirePositionData(chess.fen());

    if (hasMoves(nextPosition)) {
      yield* generateChessLines({
        getRepertoirePositionData,
        position: nextPosition!,
        previousMoves: chess.history(),
      });
    } else {
      yield chess;
    }
  }
}

const createChess = async (
  getRepertoirePositionData: GetRepertoirePositionData,
  previousMoves: string[],
) => {
  const chess = new Chess();
  await setRepertoireCommentForCurrentPosition(
    chess,
    getRepertoirePositionData,
  );

  for (const san of previousMoves) {
    const priorityComment = await getPriorityCommentForNextMove(
      chess,
      getRepertoirePositionData,
      san,
    );
    chess.move(san);
    await setRepertoireCommentForCurrentPosition(
      chess,
      getRepertoirePositionData,
      priorityComment,
    );
  }

  return chess;
};

const makeMove = async (
  chess: Chess,
  getRepertoirePositionData: GetRepertoirePositionData,
  move: RepertoireMove,
) => {
  const priorityComment = await getPriorityCommentForNextMove(
    chess,
    getRepertoirePositionData,
    move.san,
  );
  chess.move(move.san);
  await setRepertoireCommentForCurrentPosition(
    chess,
    getRepertoirePositionData,
    priorityComment,
  );
};

const getPriorityCommentForNextMove = async (
  chess: Chess,
  getRepertoirePositionData: GetRepertoirePositionData,
  nextSan: string,
) => {
  const repertoirePositionData = await getRepertoirePositionData(chess.fen());
  const nextMove = repertoirePositionData?.moves?.find(
    (move) => move.san === nextSan,
  );

  if (isNumber(nextMove?.priority)) {
    return `${PRIORITY_PGN_COMMENT_PREFIX}${nextMove.priority}`;
  }
};

const setRepertoireCommentForCurrentPosition = async (
  chess: Chess,
  getRepertoirePositionData: GetRepertoirePositionData,
  priorityComment?: string,
) => {
  const repertoirePositionData = await getRepertoirePositionData(chess.fen());
  const comment = repertoirePositionData?.comment;

  if (comment) {
    chess.setComment(comment + (priorityComment ?? ""));
  } else if (priorityComment) {
    chess.setComment(priorityComment);
  }
};

const hasMoves = (nextPosition?: RepertoirePositionData) =>
  nextPosition &&
  nextPosition?.moves?.length &&
  nextPosition?.moves?.length > 0;
