import {
  getNonReactiveState,
  handleMove,
  handlePositionStateChange,
} from "@/app/zustand/utils.ts";
import { upsertRepertoireMove } from "@/features/repertoire/repository.ts";
import { CG_WHITE, CgColor } from "@/external/chessground/defs.tsx";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { Move, PAWN } from "chess.js";
import { getAnnotationSetting } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { addMoveToPgn } from "@/external/chessops/pgn.ts";
import { Key } from "chessground/types";
import {
  ChessRepertoireStore,
  selectChess,
  SetState,
} from "@/app/zustand/store.ts";

export interface ChessboardSlice {
  orientation: CgColor;
  pendingPromotionMove: Move | null;
  handleChessboardMove: (from: Key, to: Key) => Promise<void>;
  promote: (promotion: PieceSymbol) => Promise<void>;
}

export const createChessboardSlice = (set: SetState): ChessboardSlice => ({
  orientation: CG_WHITE,
  pendingPromotionMove: null,

  promote: (promotion) => handlePromotion(set, promotion),

  handleChessboardMove: async (from, to) => {
    const chess = selectChess(getNonReactiveState());

    const pendingMove = chess
      .moves({ verbose: true })
      .find((move) => move.from === from && move.to === to);

    return handleMove(set, pendingMove);
  },
});

export const selectPendingPromotionMove = (state: ChessRepertoireStore) =>
  state.pendingPromotionMove;
export const selectPromote = (state: ChessRepertoireStore) => state.promote;
export const selectHandleChessgroundMove = (state: ChessRepertoireStore) =>
  state.handleChessboardMove;

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
