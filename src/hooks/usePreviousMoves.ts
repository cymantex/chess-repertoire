import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectPendingPromotionMove } from "@/stores/zustand/selectors.ts";

export const usePreviousMoves = () => {
  const chess = useRepertoireStore((state) => state.chess);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);

  return pendingPromotionMove ? [] : chess.history();
};
