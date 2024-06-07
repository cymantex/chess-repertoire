import { useRepertoireStore } from "@/store/useRepertoireStore.ts";
import { selectChess, selectFen } from "@/store/selectors.ts";
import { useDatabasePositionMoves } from "@/store/database/hooks.ts";
import { findNextMoves } from "@/external/chessjs/utils.ts";

export const useNextMovesWithPriority = () => {
  const chess = useRepertoireStore(selectChess);
  const fen = useRepertoireStore(selectFen);
  const movesWithPriority = useDatabasePositionMoves(fen).filter(
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
