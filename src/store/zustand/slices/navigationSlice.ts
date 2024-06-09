import { NavigationSlice, SetState } from "@/store/zustand/defs.ts";
import {
  handlePositionStateChange,
  withNonReactiveState,
} from "@/store/zustand/utils.ts";
import {
  findNextMove,
  getRemainingMainMoves,
} from "@/external/chessops/pgn.ts";

export const createNavigationSlice = (set: SetState): NavigationSlice => ({
  goToFirstMove: () =>
    withNonReactiveState((state) => {
      const { chess } = state;

      chess.reset();

      return handlePositionStateChange({ set, state });
    }),
  goToPreviousMove: async () =>
    withNonReactiveState((state) => {
      const { chess } = state;

      chess.undo();

      return handlePositionStateChange({ set, state });
    }),
  goToNextMove: async () =>
    withNonReactiveState((state) => {
      const { chess } = state;

      const nextMove = findNextMove(state.pgn, chess.history());

      if (nextMove) {
        chess.move(nextMove.data.san);
      } else {
        return Promise.resolve();
      }

      return handlePositionStateChange({ set, state });
    }),
  goToLastMove: async () =>
    withNonReactiveState((state) => {
      const { chess } = state;

      const remainingMainMoves = getRemainingMainMoves(
        state.pgn,
        chess.history(),
      );

      if (remainingMainMoves.length === 0) return Promise.resolve();

      remainingMainMoves.forEach((move) => chess.move(move));

      return handlePositionStateChange({ set, state });
    }),
});
