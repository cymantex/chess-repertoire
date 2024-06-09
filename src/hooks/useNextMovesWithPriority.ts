import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import {
  selectChess,
  selectCurrentRepertoirePositionMoves,
} from "@/store/selectors.ts";
import { findNextMoves } from "@/external/chessjs/utils.ts";

export const useNextMovesWithPriority = () => {
  const chess = useRepertoireStore(selectChess);
  const repertoireMoves =
    useRepertoireStore(selectCurrentRepertoirePositionMoves) ?? [];
  const movesWithPriority = repertoireMoves.filter(
    (move) => move.priority !== undefined && move.priority !== null,
  );

  return findNextMoves(
    chess,
    movesWithPriority.map((move) => move.san),
  ).map((move) => ({
    ...move,
    priority: movesWithPriority.find((m) => m.san === move.san)!.priority,
  }));
};
