import { NavigationSlice, SetState } from "@/stores/zustand/defs.ts";
import {
  getNonReactiveState,
  handlePositionStateChange,
} from "@/stores/zustand/utils.ts";
import {
  findNextMove,
  getRemainingMainMoves,
} from "@/external/chessops/pgn.ts";
import { selectChess } from "@/stores/zustand/selectors.ts";

export const createNavigationSlice = (set: SetState): NavigationSlice => ({
  goToFirstMove: () => {
    const chess = selectChess(getNonReactiveState());

    chess.reset();

    return handlePositionStateChange({ set });
  },

  goToPreviousMove: async () => {
    const chess = selectChess(getNonReactiveState());

    chess.undo();

    return handlePositionStateChange({ set });
  },

  goToNextMove: async () => {
    const { chess, pgn } = getNonReactiveState();

    const nextMove = findNextMove(pgn, chess.history());

    if (nextMove) {
      chess.move(nextMove.data.san);
    } else {
      return Promise.resolve();
    }

    return handlePositionStateChange({ set });
  },

  goToLastMove: async () => {
    const { chess, pgn } = getNonReactiveState();

    const remainingMainMoves = getRemainingMainMoves(pgn, chess.history());

    if (remainingMainMoves.length === 0) return Promise.resolve();

    remainingMainMoves.forEach((move) => chess.move(move));

    return handlePositionStateChange({ set });
  },
});
