import { NavigationSlice, SetState } from "@/stores/zustand/defs.ts";
import {
  getNonReactiveState,
  handlePositionStateChange,
} from "@/stores/zustand/utils.ts";
import {
  findNextMove,
  getRemainingMainMoves,
} from "@/external/chessops/pgn.ts";

export const createNavigationSlice = (set: SetState): NavigationSlice => ({
  goToPosition: async (movesFromStartingPosition) => {
    const { chess, pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    chess.reset();
    movesFromStartingPosition.forEach((move) => chess.move(move));

    return handlePositionStateChange({ set });
  },

  goToFirstMove: () => {
    const { chess, pendingPromotionMove } = getNonReactiveState();
    if (pendingPromotionMove) return Promise.resolve();

    chess.reset();

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
