import { GetRepertoirePosition } from "@/pgn/export/generateChessLines.ts";
import { RepertoirePgnPosition } from "@/defs.ts";
import { Chess } from "chess.js";
import { isNumber, isString, last } from "lodash";
import { getAnnotation } from "@/assets/annotation/defs.ts";
import { isNotEmptyArray } from "@/utils/utils.ts";

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
    chess.header("Repertoire", JSON.stringify(positions).replaceAll('"', "'"));
  }

  return chess.pgn();
};

export const extractPlayerNames = (partialPgn: string) => {
  const playerNames = new Set<string>();

  const whitePlayer = partialPgn.match(/\[White "(.*)"]/);
  if (whitePlayer) {
    playerNames.add(whitePlayer[1]);
  }

  const blackPlayer = partialPgn.match(/\[Black "(.*)"]/);
  if (blackPlayer) {
    playerNames.add(blackPlayer[1]);
  }

  return Array.from(playerNames);
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

  history.push({ ...lastItem, before: lastItem.after, san: "not-a-real-move" });

  const repertoirePositionList = await Promise.all(
    history.map(({ before }) => getRepertoirePosition(before)),
  );

  return repertoirePositionList
    .map((position, index) => {
      const move = history[index];
      const shapes = position?.shapes ?? [];

      return {
        shapes: isNotEmptyArray(shapes) ? shapes : undefined,
        move: position?.moves
          ?.filter((move) => isNumber(move.annotation))
          .find((m) => m.san === move.san),
        fen: history[index].before,
      };
    })
    .filter(
      (position) =>
        isNotEmptyArray(position.shapes) ||
        isString(getAnnotation(position?.move?.annotation)?.symbol),
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
