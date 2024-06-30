import { ChessRepertoireStore } from "@/stores/zustand/defs.ts";

export const selectChess = (state: ChessRepertoireStore) => state.chess;
export const selectFen = (state: ChessRepertoireStore) => state.fen;
export const selectPgn = (state: ChessRepertoireStore) => state.pgn;
export const selectSavePgn = (state: ChessRepertoireStore) => state.savePgn;
export const selectSidebar = (state: ChessRepertoireStore) => state.sidebar;
export const selectOpenSidebar = (state: ChessRepertoireStore) =>
  state.openSidebar;

// Repertoire
export const selectDatabases = (state: ChessRepertoireStore) => state.databases;
export const selectSelectedDatabase = (state: ChessRepertoireStore) =>
  state.selectedDatabase;
export const selectSelectDatabase = (state: ChessRepertoireStore) =>
  state.selectDatabase;
export const selectCreateDatabase = (state: ChessRepertoireStore) =>
  state.createDatabase;
export const selectListDatabases = (state: ChessRepertoireStore) =>
  state.listDatabases;
export const selectUpsertMove = (state: ChessRepertoireStore) =>
  state.upsertMove;
export const selectDeleteMove = (state: ChessRepertoireStore) =>
  state.deleteMove;
export const selectSetShapes = (state: ChessRepertoireStore) => state.setShapes;
export const selectGetCurrentRepertoirePosition = (
  state: ChessRepertoireStore,
) => state.getCurrentRepertoirePosition;
export const selectFetchingRepertoirePosition = (state: ChessRepertoireStore) =>
  state.fetchingRepertoirePosition;
export const selectCurrentRepertoirePositionComments = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePosition?.comments;
export const selectCurrentRepertoirePositionMoves = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePosition?.moves;
export const selectCurrentRepertoirePositionShapes = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePosition?.shapes;

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
