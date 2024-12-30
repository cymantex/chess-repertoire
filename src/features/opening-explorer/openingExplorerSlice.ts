import { getNonReactiveState, handleMove } from "@/app/zustand/utils.ts";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";
import type { RepertoireOpeningExplorerMove } from "@/features/repertoire/defs.ts";
import type { Move } from "chess.js";
import type { ChessRepertoireStore, SetState } from "@/app/zustand/store.ts";

export interface OpeningExplorerSlice {
  hoveredOpeningMove: Move | null;
  setHoveredOpeningMove: (
    openingMove: RepertoireOpeningExplorerMove | null,
  ) => void;
  handleOpeningExplorerMove: (
    openingMove: RepertoireOpeningExplorerMove,
  ) => void;
}

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

export const selectHoveredOpeningMove = (state: ChessRepertoireStore) =>
  state.hoveredOpeningMove;
export const selectSetHoveredOpeningMove = (state: ChessRepertoireStore) =>
  state.setHoveredOpeningMove;
export const selectHandleOpeningExplorerMove = (state: ChessRepertoireStore) =>
  state.handleOpeningExplorerMove;
