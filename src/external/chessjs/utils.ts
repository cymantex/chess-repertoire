import { Chess, Square, SQUARES, WHITE } from "chess.js";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";
import {
  OpeningExplorerMove,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
  RepertoirePgnPosition,
} from "@/defs.ts";
import { isNumber, last } from "lodash";
import { GetRepertoirePosition } from "@/utils/generateChessLines.ts";
import { getAnnotation } from "@/assets/annotation/defs.ts";

export const calcPossibleDestinations = (chess: Chess) => {
  const possibleDestinations = new Map<Square, Square[]>();

  SQUARES.forEach((square) => {
    const moves = chess.moves({ square, verbose: true });
    if (moves.length)
      possibleDestinations.set(
        square,
        moves.map((move) => move.to),
      );
  });

  return possibleDestinations;
};

export const findNextMoveBySan = (chess: Chess, san: string) =>
  chess.moves({ verbose: true }).find((move) => move.san === san);

export const determineTurnColor = (chess: Chess) =>
  chess.turn() === WHITE ? CG_WHITE : CG_BLACK;

export const findNextMoves = (chess: Chess, sanList: string[]) =>
  chess.moves({ verbose: true }).filter((move) => sanList.includes(move.san));

export const toRepertoireOpeningExplorerMoves = (
  chess: Chess,
  moves: (OpeningExplorerMove | RepertoireMove)[],
): RepertoireOpeningExplorerMove[] =>
  moves.map((move) => {
    const nextMove = findNextMoveBySan(chess, move.san);
    return { ...nextMove, ...move } as RepertoireOpeningExplorerMove;
  });

export const toPgn = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
) => {
  const positions = await toRepertoirePgnPositions(
    chess,
    getRepertoirePosition,
  );
  chess.header("Result", "*");
  if (Object.keys(positions).length !== 0) {
    chess.header("Repertoire", JSON.stringify(positions));
  }
  return chess.pgn();
};

const toRepertoirePgnPositions = async (
  chess: Chess,
  getRepertoirePosition: GetRepertoirePosition,
): Promise<Record<string, RepertoirePgnPosition>> => {
  const history = chess.history({ verbose: true });
  const lastItem = last(history);

  if (!lastItem) {
    return {};
  }

  history.push({ ...lastItem, before: lastItem.after });

  const repertoirePositionList = await Promise.all(
    history.map(({ before }) => getRepertoirePosition(before)),
  );

  return repertoirePositionList
    .map((position, index) => {
      const move = history[index];
      const shapes = position?.shapes ?? [];

      return {
        shapes: shapes.length > 0 ? shapes : undefined,
        move: position?.moves
          ?.filter((move) => isNumber(move.annotation))
          .find((m) => m.san === move.san),
        fen: history[index].before,
      };
    })
    .filter(
      (position) =>
        !!position.shapes ||
        !!getAnnotation(position?.move?.annotation)?.symbol,
    )
    .reduce(
      (pgnPositions, { shapes, move, fen }) => {
        const annotation = getAnnotation(move?.annotation);
        pgnPositions[fen] = {
          shapes,
          move: annotation?.symbol
            ? {
                san: move!.san,
                annotation: annotation.symbol,
              }
            : undefined,
        };
        return pgnPositions;
      },
      {} as Record<string, RepertoirePgnPosition>,
    );
};
