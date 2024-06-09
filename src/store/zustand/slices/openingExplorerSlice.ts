import { OpeningExplorerSlice, SetState } from "@/store/zustand/defs.ts";
import { getNonReactiveState, handleMove } from "@/store/zustand/utils.ts";
import { RepertoireOpeningExplorerMove } from "@/defs.ts";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";

export const createOpeningExplorerSlice = (
  set: SetState,
): OpeningExplorerSlice => ({
  hoveredOpeningMove: null,

  handleOpeningExplorerMove: (openingMove) =>
    handleMove(set, findOpeningMove(openingMove)),

  setHoveredOpeningMove: (openingMove) =>
    set({
      hoveredOpeningMove:
        openingMove === null ? null : findOpeningMove(openingMove),
    }),
});

const findOpeningMove = (openingMove: RepertoireOpeningExplorerMove) => {
  const { chess } = getNonReactiveState();
  return findNextMoveBySan(chess, openingMove.san);
};
