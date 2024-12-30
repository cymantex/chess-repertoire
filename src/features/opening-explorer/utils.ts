import type { Chess } from "chess.js";
import { isNumber, orderBy, uniqBy } from "lodash";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";
import type {
  AnnotatedMove,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
} from "@/features/repertoire/defs.ts";
import { removeDecorations } from "@/common/utils/utils.ts";
import type { OpeningExplorerMove } from "@/features/opening-explorer/defs.ts";

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

export const calcPercentage = (games: number, totalGames: number) =>
  (games / totalGames) * 100;

export const shortenLargeNumber = (num: number) => {
  if (num >= 1.0e12) return (num / 1.0e12).toFixed(2) + "T";
  else if (num >= 1.0e9) return (num / 1.0e9).toFixed(2) + "B";
  else if (num >= 1.0e6) return (num / 1.0e6).toFixed(2) + "M";
  else if (num >= 1.0e3) return (num / 1.0e3).toFixed(2) + "K";
  else return prettifyLargeNumber(num);
};

export const prettifyLargeNumber = (num: number) =>
  new Intl.NumberFormat().format(num);

export const calcPositionStats = (moves: OpeningExplorerMove[]) =>
  moves.reduce(
    (positionStats, move) => {
      positionStats.white += move.white;
      positionStats.draws += move.draws;
      positionStats.black += move.black;
      positionStats.totalGames += calcTotalGames(move);

      return positionStats;
    },
    { white: 0, draws: 0, black: 0, totalGames: 0 },
  );
