import { OpeningExplorerMove } from "@/defs.ts";
import { Chess } from "chess.js";
import { isNumber, orderBy, uniqBy } from "lodash";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";
import {
  AnnotatedMove,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
} from "@/repertoire/defs.ts";
import { removeDecorations } from "@/utils/utils.ts";

const NUMBER_LARGER_THAN_WORST_ANNOTATION = 10000;
const NUMBER_LARGER_THAN_TOTAL_GAMES = 1000_000_000;

export const calcTotalGames = (
  move: RepertoireOpeningExplorerMove | OpeningExplorerMove,
) => {
  if (isOpeningExplorerMove(move)) return move.white + move.draws + move.black;
  return 0;
};

export const isOpeningExplorerMove = (
  move: OpeningExplorerMove | AnnotatedMove,
): move is OpeningExplorerMove =>
  (move as OpeningExplorerMove).averageRating !== undefined;

const orderByAnnotationThenInRepertoireThenTotalGames = (
  moves: RepertoireOpeningExplorerMove[],
  repertoireMoves: RepertoireMove[],
) =>
  orderBy(
    moves,
    (move) => {
      const repertoireMove = repertoireMoves.find((m) => m.san === move.san);

      if (isNumber(repertoireMove?.annotation))
        return NUMBER_LARGER_THAN_TOTAL_GAMES - repertoireMove?.annotation;
      if (repertoireMove)
        return (
          NUMBER_LARGER_THAN_TOTAL_GAMES - NUMBER_LARGER_THAN_WORST_ANNOTATION
        );
      if (isOpeningExplorerMove(move)) return calcTotalGames(move);

      return move.san;
    },
    "desc",
  );

export const toRepertoireOpeningExplorerMoves = (
  chess: Chess,
  moves: (OpeningExplorerMove | RepertoireMove)[],
): RepertoireOpeningExplorerMove[] =>
  moves.map((move) => {
    const nextMove = findNextMoveBySan(chess, move.san);
    return { ...nextMove, ...move } as RepertoireOpeningExplorerMove;
  });

export const toOrderedRepertoireOpeningExplorerMoves = (
  chess: Chess,
  moves: OpeningExplorerMove[],
  repertoireMoves: RepertoireMove[],
) => {
  const repertoireOpeningExplorerMoves = toRepertoireOpeningExplorerMoves(
    chess,
    uniqBy([...moves, ...repertoireMoves], (move) =>
      removeDecorations(move.san),
    ),
  );
  return orderByAnnotationThenInRepertoireThenTotalGames(
    repertoireOpeningExplorerMoves,
    repertoireMoves,
  );
};
