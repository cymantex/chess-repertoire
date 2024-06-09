import {
  ChessRepertoireStore,
  OpeningExplorerSlice,
  SetState,
} from "@/store/zustand/defs.ts";
import { handleMove, withNonReactiveState } from "@/store/zustand/utils.ts";
import { RepertoireOpeningExplorerMove } from "@/defs.ts";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";

export const createOpeningExplorerSlice = (
  set: SetState,
): OpeningExplorerSlice => ({
  hoveredOpeningMove: null,
  handleOpeningExplorerMove: (openingMove) =>
    withNonReactiveState((state) =>
      handleMove(set, state, findOpeningMove(state, openingMove)),
    ),
  setHoveredOpeningMove: (openingMove) =>
    set((state) => {
      return {
        ...state,
        hoveredOpeningMove:
          openingMove === null ? null : findOpeningMove(state, openingMove),
      };
    }),
});

export const findOpeningMove = (
  state: ChessRepertoireStore,
  openingMove: RepertoireOpeningExplorerMove,
) => {
  const { chess } = state;

  return findNextMoveBySan(chess, openingMove.san);
};
