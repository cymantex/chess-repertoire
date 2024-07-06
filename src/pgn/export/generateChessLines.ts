import { Chess } from "chess.js";
import { isNotEmptyArray } from "@/utils/utils.ts";
import { RepertoirePosition } from "@/repertoire/defs.ts";

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
    const chess = await createChess(previousMoves);
    chess.move(move.san);

    const nextPosition = await getRepertoirePosition(chess.fen());

    if (isNotEmptyArray(nextPosition?.moves)) {
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

const createChess = async (previousMoves: string[]) => {
  const chess = new Chess();

  for (const san of previousMoves) {
    chess.move(san);
  }

  return chess;
};
