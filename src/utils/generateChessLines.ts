// @ts-ignore
import {
  PRIORITY_PGN_COMMENT_PREFIX,
  RepertoireMove,
  RepertoirePositionData,
} from "@/defs.ts";
import { Chess } from "chess.js";
import { isNumber } from "lodash";

type GetRepertoirePositionData = (fen: string) => RepertoirePositionData | null;

interface GenerateChessLinesProps {
  getRepertoirePositionData: GetRepertoirePositionData;
  position: RepertoirePositionData | null;
  previousMoves: string[];
}

export function* generateChessLines({
  getRepertoirePositionData,
  position,
  previousMoves,
}: GenerateChessLinesProps): Generator<Chess> {
  if (!position) return;

  for (const move of position.moves!) {
    const chess = createChess(getRepertoirePositionData, previousMoves);
    makeMove(chess, getRepertoirePositionData, move);

    const nextPosition = getRepertoirePositionData(chess.fen());

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

const createChess = (
  getRepertoirePositionData: GetRepertoirePositionData,
  previousMoves: string[],
) => {
  const chess = new Chess();
  setRepertoireCommentForCurrentPosition(chess, getRepertoirePositionData);

  previousMoves.forEach((san) => {
    const priorityComment = getPriorityCommentForNextMove(
      chess,
      getRepertoirePositionData,
      san,
    );
    chess.move(san);
    setRepertoireCommentForCurrentPosition(
      chess,
      getRepertoirePositionData,
      priorityComment,
    );
  });
  return chess;
};

const makeMove = (
  chess: Chess,
  getRepertoirePositionData: GetRepertoirePositionData,
  move: RepertoireMove,
) => {
  const priorityComment = getPriorityCommentForNextMove(
    chess,
    getRepertoirePositionData,
    move.san,
  );
  chess.move(move.san);
  setRepertoireCommentForCurrentPosition(
    chess,
    getRepertoirePositionData,
    priorityComment,
  );
};

const getPriorityCommentForNextMove = (
  chess: Chess,
  getRepertoirePositionData: GetRepertoirePositionData,
  nextSan: string,
) => {
  const nextMove = getRepertoirePositionData(chess.fen())?.moves?.find(
    (move) => move.san === nextSan,
  );

  if (isNumber(nextMove?.priority)) {
    return `${PRIORITY_PGN_COMMENT_PREFIX}${nextMove.priority}`;
  }
};

const setRepertoireCommentForCurrentPosition = (
  chess: Chess,
  getRepertoirePositionData: GetRepertoirePositionData,
  priorityComment?: string,
) => {
  const comment = getRepertoirePositionData(chess.fen())?.comment;

  if (comment) {
    chess.setComment(comment + (priorityComment ?? ""));
  } else if (priorityComment) {
    chess.setComment(priorityComment);
  }
};

const hasMoves = (nextPosition: RepertoirePositionData | null) =>
  nextPosition &&
  nextPosition?.moves?.length &&
  nextPosition?.moves?.length > 0;
