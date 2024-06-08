import {
  ChessRepertoireStore,
  useRepertoireStore,
} from "@/store/useRepertoireStore.ts";

export const selectChess = (state: ChessRepertoireStore) => state.chess;
export const selectFen = (state: ChessRepertoireStore) => state.pgn.fen;
export const selectPgn = (state: ChessRepertoireStore) => state.pgn;

// IDB
export const selectUpsertMove = (state: ChessRepertoireStore) =>
  state.upsertMove;
export const selectDeleteMove = (state: ChessRepertoireStore) =>
  state.deleteMove;
export const selectGetCurrentRepertoirePositionData = (
  state: ChessRepertoireStore,
) => state.getCurrentRepertoirePositionData;
export const selectCurrentRepertoirePositionComment = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePositionData?.comment;
export const selectCurrentRepertoirePositionMoves = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePositionData?.moves;

// TODO: Replace with selectors
export const useCurrentRepertoirePositionComment = () =>
  useRepertoireStore(selectCurrentRepertoirePositionComment) ?? "";
export const useCurrentRepertoirePositionMoves = () =>
  useRepertoireStore(selectCurrentRepertoirePositionMoves) ?? [];

// Chessground
export const selectOrientation = (state: ChessRepertoireStore) =>
  state.orientation;
export const selectRotate = (state: ChessRepertoireStore) => state.rotate;
export const selectPendingPromotionMove = (state: ChessRepertoireStore) =>
  state.pendingPromotionMove;
export const selectPromote = (state: ChessRepertoireStore) => state.promote;
export const selectHandleChessgroundMove = (state: ChessRepertoireStore) =>
  state.handleChessgroundMove;

// Opening Explorer
export const selectHoveredOpeningMove = (state: ChessRepertoireStore) =>
  state.hoveredOpeningMove;
export const selectSetHoveredOpeningMove = (state: ChessRepertoireStore) =>
  state.setHoveredOpeningMove;
export const selectHandleOpeningExplorerMove = (state: ChessRepertoireStore) =>
  state.handleOpeningExplorerMove;

// Navigation
export const selectGoToFirstMove = (state: ChessRepertoireStore) =>
  state.goToFirstMove;
export const selectGoToPreviousMove = (state: ChessRepertoireStore) =>
  state.goToPreviousMove;
export const selectGoToNextMove = (state: ChessRepertoireStore) =>
  state.goToNextMove;
export const selectGoToLastMove = (state: ChessRepertoireStore) =>
  state.goToLastMove;
