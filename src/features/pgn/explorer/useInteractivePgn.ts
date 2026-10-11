import {
  selectPgn,
  useRepertoireStore,
} from "@/app/zustand/store.ts";
import { enrichMovesWithFen } from "@/external/chessops/pgn.ts";
import { selectPendingPromotionMove } from "@/features/chessboard/chessboardSlice.ts";

export const useInteractivePgn = () => {
  const pgn = useRepertoireStore(selectPgn);
  const selectedPath = useRepertoireStore((state) =>
    state.chess.history().join(" "),
  );
  const pendingPromotionMove = useRepertoireStore(selectPendingPromotionMove);

  return {
    pgn: enrichMovesWithFen({ ...pgn }),
    disabled: !!pendingPromotionMove,
    isSelectedMove: (path: string[]) => path.join(" ") === selectedPath,
  };
};
