import {
  ChessgroundSlice,
  ChessRepertoireStore,
  SetState,
} from "@/store/zustand/defs.ts";
import {
  handleMove,
  handlePositionStateChange,
  withNonReactiveState,
} from "@/store/zustand/utils.ts";
import { upsertRepertoireMove } from "@/store/repertoireRepository.ts";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { PAWN } from "chess.js";
import { getPrioritySetting } from "@/store/localStorageStore.ts";
import { addMoveToPgn } from "@/external/chessops/pgn.ts";

export const createChessgroundSlice = (set: SetState): ChessgroundSlice => ({
  orientation: CG_WHITE,
  pendingPromotionMove: null,

  rotate: () =>
    set((state) => ({
      ...state,
      orientation: state.orientation === CG_WHITE ? CG_BLACK : CG_WHITE,
    })),

  promote: (promotion) =>
    withNonReactiveState((state) => handlePromotion(set, state, promotion)),

  handleChessgroundMove: async (from, to) =>
    withNonReactiveState((state) => {
      const { chess } = state;

      const pendingMove = chess
        .moves({ verbose: true })
        .find((move) => move.from === from && move.to === to);

      return handleMove(set, state, pendingMove);
    }),
});

export const handlePromotion = (
  set: SetState,
  state: ChessRepertoireStore,
  promotion: PieceSymbol,
) => {
  const { pendingPromotionMove, chess } = state;

  if (!pendingPromotionMove) return Promise.resolve();

  // Add back the pawn hidden before doing the promotion
  chess.put({ type: PAWN, color: chess.turn() }, pendingPromotionMove.from);
  const upsertPromise = upsertRepertoireMove(
    chess.fen(),
    {
      san: pendingPromotionMove.san,
    },
    getPrioritySetting(),
  );
  addMoveToPgn(state.pgn, pendingPromotionMove.san, chess.history());
  chess.move({ ...pendingPromotionMove, promotion });

  return handlePositionStateChange({
    set,
    state,
    promisesToResolveBeforeUpdatingPositionData: [upsertPromise],
  });
};
