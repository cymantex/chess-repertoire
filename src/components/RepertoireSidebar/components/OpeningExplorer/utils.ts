import {
  OpeningExplorerMove,
  PriorityMove,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
} from "@/defs.ts";
import { Chess } from "chess.js";
import { toRepertoireOpeningExplorerMoves } from "@/external/chessjs/utils.ts";
import { isNumber, orderBy, uniqBy } from "lodash";

const NUMBER_LARGER_THAN_LOWEST_PRIORITY = 1000;
const NUMBER_LARGER_THAN_TOTAL_GAMES = 1000_000_000;

export const calcTotalGames = (move: RepertoireOpeningExplorerMove) => {
  if (isOpeningExplorerMove(move)) return move.white + move.draws + move.black;
  return "";
};

const isOpeningExplorerMove = (
  move: OpeningExplorerMove | PriorityMove,
): move is OpeningExplorerMove =>
  (move as OpeningExplorerMove).averageRating !== undefined;

const orderByPriorityThenInRepertoireThenTotalGames = (
  moves: RepertoireOpeningExplorerMove[],
  repertoireMoves: RepertoireMove[],
) =>
  orderBy(
    moves,
    (move) => {
      const repertoireMove = repertoireMoves.find((m) => m.san === move.san);

      if (isNumber(repertoireMove?.priority))
        return NUMBER_LARGER_THAN_TOTAL_GAMES - repertoireMove.priority;
      if (repertoireMove)
        return (
          NUMBER_LARGER_THAN_TOTAL_GAMES - NUMBER_LARGER_THAN_LOWEST_PRIORITY
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
  return orderByPriorityThenInRepertoireThenTotalGames(
    repertoireOpeningExplorerMoves,
    repertoireMoves,
  );
};
