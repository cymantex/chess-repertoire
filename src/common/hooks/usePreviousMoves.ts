import { useRepertoireStore } from "@/app/zustand/store.ts";

import { selectPendingPromotionMove } from "@/features/chessboard/chessboardSlice.ts";

export const usePreviousMoves = () => {
  const chess = useRepertoireStore((state) => state.chess);
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);

  return pendingPromotionMove ? [] : chess.history();
};
