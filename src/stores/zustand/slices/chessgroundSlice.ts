import { ChessgroundSlice, SetState } from "@/stores/zustand/defs.ts";
import {
  getNonReactiveState,
  handleMove,
  handlePositionStateChange,
} from "@/stores/zustand/utils.ts";
import { upsertRepertoireMove } from "@/repertoire/repertoireRepository.ts";
import { CG_BLACK, CG_WHITE } from "@/external/chessground/defs.tsx";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { PAWN } from "chess.js";
import { getAnnotationSetting } from "@/stores/localStorageStore.ts";
import { addMoveToPgn } from "@/external/chessops/pgn.ts";
import { selectChess } from "@/stores/zustand/selectors.ts";

export const createChessgroundSlice = (set: SetState): ChessgroundSlice => ({
  orientation: CG_WHITE,
  pendingPromotionMove: null,

  rotate: () =>
    set((state) => ({
      orientation: state.orientation === CG_WHITE ? CG_BLACK : CG_WHITE,
    })),

  promote: (promotion) => handlePromotion(set, promotion),

  handleChessgroundMove: async (from, to) => {
    const chess = selectChess(getNonReactiveState());

    const pendingMove = chess
      .moves({ verbose: true })
      .find((move) => move.from === from && move.to === to);

    return handleMove(set, pendingMove);
  },
});

export const handlePromotion = (set: SetState, promotion: PieceSymbol) => {
  const { pendingPromotionMove, chess, pgn } = getNonReactiveState();

  if (!pendingPromotionMove) return Promise.resolve();

  // Add back the pawn hidden before doing the promotion
  chess.put({ type: PAWN, color: chess.turn() }, pendingPromotionMove.from);

  const fenBeforePromotion = chess.fen();
  const historyBeforePromotion = chess.history();

  // The pendingPromotionMove does not contain what piece is being promoted to
  const promotionMove = chess.move({ ...pendingPromotionMove, promotion });

  const upsertPromise = upsertRepertoireMove(
    fenBeforePromotion,
    {
      san: promotionMove.san,
    },
    getAnnotationSetting(),
  );
  addMoveToPgn(pgn, promotionMove.san, historyBeforePromotion);

  return handlePositionStateChange({
    set,
    promisesToResolveBeforeUpdatingRepertoirePosition: [upsertPromise],
  });
};
