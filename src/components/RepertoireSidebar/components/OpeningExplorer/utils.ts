import {
  AnnotatedMove,
  OpeningExplorerMove,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
} from "@/defs.ts";
import { Chess } from "chess.js";
import { isNumber, orderBy, uniqBy } from "lodash";
import { toRepertoireOpeningExplorerMoves } from "@/utils/utils.ts";

const NUMBER_LARGER_THAN_WORST_ANNOTATION = 10000;
const NUMBER_LARGER_THAN_TOTAL_GAMES = 1000_000_000;

export const calcTotalGames = (move: RepertoireOpeningExplorerMove) => {
  if (isOpeningExplorerMove(move)) return move.white + move.draws + move.black;
  return "";
};

const isOpeningExplorerMove = (
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

export const toOrderedRepertoireOpeningExplorerMoves = (
  chess: Chess,
  moves: OpeningExplorerMove[],
  repertoireMoves: RepertoireMove[],
) => {
  const repertoireOpeningExplorerMoves = toRepertoireOpeningExplorerMoves(
    chess,
    uniqBy([...moves, ...repertoireMoves], "san"),
  );
  return orderByAnnotationThenInRepertoireThenTotalGames(
    repertoireOpeningExplorerMoves,
    repertoireMoves,
  );
};
