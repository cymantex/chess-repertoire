import { selectChess, useRepertoireStore } from "@/app/zustand/store.ts";
import { findNextMoves } from "@/external/chessjs/utils.ts";
import { selectCurrentRepertoirePositionMoves } from "@/features/repertoire/repertoireSlice.ts";

export const useNextAnnotatedMoves = () => {
  const chess = useRepertoireStore(selectChess);
  const repertoireMoves =
    useRepertoireStore(selectCurrentRepertoirePositionMoves) ?? [];
  const annotatedMoves = repertoireMoves.filter(
    (move) => move.annotation !== undefined && move.annotation !== null,
  );

  return findNextMoves(
    chess,
    annotatedMoves.map((move) => move.san),
  ).map((move) => ({
    ...move,
    annotation: annotatedMoves.find((m) => m.san === move.san)!.annotation,
  }));
};
