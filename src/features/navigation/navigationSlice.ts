import {
  getNonReactiveState,
  handlePositionStateChange,
  resetGame,
} from "@/app/zustand/utils.ts";
import {
  addVariationToPgn,
  findNextMove,
  getRemainingMainMoves,
} from "@/external/chessops/pgn.ts";
import { ChessRepertoireStore, SetState } from "@/app/zustand/store.ts";

export interface NavigationSlice {
  goToPosition: (movesFromStartingPosition: string[]) => Promise<void>;
  goToFirstMove: () => Promise<void>;
  goToPreviousMove: () => Promise<void>;
  goToNextMove: () => Promise<void>;
  goToLastMove: () => Promise<void>;
}

export const createNavigationSlice = (set: SetState): NavigationSlice => ({
  goToPosition: async (movesFromStartingPosition) => {
    const { pgn, chess, pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    resetGame();
    movesFromStartingPosition.forEach((move) => chess.move(move));
    addVariationToPgn(pgn, movesFromStartingPosition);

    return handlePositionStateChange({ set });
  },

  goToFirstMove: () => {
    const { pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    resetGame();

    return handlePositionStateChange({ set });
  },

  goToPreviousMove: async () => {
    const { chess, pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    chess.undo();

    return handlePositionStateChange({ set });
  },

  goToNextMove: async () => {
    const { chess, pgn, pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    const nextMove = findNextMove(pgn, chess.history());

    if (nextMove) {
      chess.move(nextMove.data.san);
    } else {
      return Promise.resolve();
    }

    return handlePositionStateChange({ set });
  },

  goToLastMove: async () => {
    const { chess, pgn, pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    const remainingMainMoves = getRemainingMainMoves(pgn, chess.history());

    if (remainingMainMoves.length === 0) return Promise.resolve();

    remainingMainMoves.forEach((move) => chess.move(move));

    return handlePositionStateChange({ set });
  },
});

export const selectGoToPosition = (state: ChessRepertoireStore) =>
  state.goToPosition;
export const selectGoToFirstMove = (state: ChessRepertoireStore) =>
  state.goToFirstMove;
export const selectGoToPreviousMove = (state: ChessRepertoireStore) =>
  state.goToPreviousMove;
export const selectGoToNextMove = (state: ChessRepertoireStore) =>
  state.goToNextMove;
export const selectGoToLastMove = (state: ChessRepertoireStore) =>
  state.goToLastMove;
