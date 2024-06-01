import { create } from "zustand";
import { Chess, Move, PAWN } from "chess.js";
import { Key } from "chessground/types";
import {
  CG_BLACK,
  CG_WHITE,
  CJ_PROMOTION_FLAG,
} from "@/chessboard/constants.ts";
import { PieceSymbol } from "chess.js/src/chess.ts";

import { OpeningExplorerMove } from "@/opening-explorer/types.ts";
import { CgColor } from "@/chessboard/types.ts";

const globalChess = new Chess();
const startingPositionFen = globalChess.fen();

interface ChessRepertoireStore {
  chess: Chess;
  orientation: CgColor;
  fen: string;
  lastMove: Move | null;
  hoveredOpeningMove: Move | null;
  pendingPromotionMove: Move | null;

  // Load PGN / FEN
  setFenIfValid: (fen: string) => void;
  setPgnIfValid: (pgn: string) => void;

  // Chessground
  rotate: () => void;
  handleChessgroundMove: (from: Key, to: Key) => void;
  promote: (promotion: PieceSymbol) => void;

  // Opening Explorer
  setHoveredOpeningMove: (openingMove: OpeningExplorerMove | null) => void;
  handleOpeningExplorerMove: (openingMove: OpeningExplorerMove) => void;

  // Navigation
  goToFirstMove: () => void;
  goToPreviousMove: () => void;
  goToNextMove: () => void;
  goToLastMove: () => void;
}

export const useChessRepertoireStore = create<ChessRepertoireStore>((set) => ({
  orientation: CG_WHITE,
  chess: globalChess,
  fen: startingPositionFen,
  lastMove: null,
  hoveredOpeningMove: null,
  pendingPromotionMove: null,

  // Load PGN / FEN
  setPgnIfValid: (pgn) =>
    set((state) => {
      const { chess } = state;

      try {
        chess.loadPgn(pgn);
        return resetState(state);
      } catch (error) {
        return state;
      }
    }),
  setFenIfValid: (fen) =>
    set((state) => {
      const { chess } = state;

      try {
        chess.load(fen);
        return resetState(state);
      } catch (error) {
        return state;
      }
    }),

  // Chessground
  rotate: () =>
    set((state) => ({
      ...state,
      orientation: state.orientation === CG_WHITE ? CG_BLACK : CG_WHITE,
    })),
  promote: (promotion: PieceSymbol) =>
    set((state) => {
      const { pendingPromotionMove, chess } = state;

      if (!pendingPromotionMove) return state;

      // Add back the pawn hidden before doing the promotion
      chess.put({ type: PAWN, color: chess.turn() }, pendingPromotionMove.from);
      chess.move({ ...pendingPromotionMove, promotion });

      return resetState(state);
    }),
  handleChessgroundMove: (from: Key, to: Key) =>
    set((state) => {
      const { chess } = state;

      const pendingMove = chess
        .moves({ verbose: true })
        .find((move) => move.from === from && move.to === to);

      return handleMove(state, pendingMove);
    }),

  // Opening Explorer
  handleOpeningExplorerMove: (openingMove: OpeningExplorerMove) =>
    set((state) => handleMove(state, findOpeningMove(state, openingMove))),
  setHoveredOpeningMove: (openingMove) =>
    set((state) => {
      return {
        ...state,
        hoveredOpeningMove:
          openingMove === null ? null : findOpeningMove(state, openingMove),
      };
    }),

  // Navigation
  goToFirstMove: () =>
    set((state) => {
      const { chess } = state;

      chess.reset();

      return resetState(state);
    }),
  goToPreviousMove: () =>
    set((state) => {
      const { chess } = state;

      chess.undo();

      return resetState(state);
    }),
  goToNextMove: () =>
    set((state) => {
      const { chess } = state;

      const nextMove = chess.history()[0];

      if (nextMove) {
        chess.move(nextMove);
      }

      return resetState(state);
    }),
  goToLastMove: () =>
    set((state) => {
      const { chess } = state;

      chess.history().forEach((move) => chess.move(move));

      return resetState(state);
    }),
}));

const resetState = (state: ChessRepertoireStore) => ({
  ...state,
  fen: state.chess.fen(),
  lastMove: null,
  hoveredOpeningMove: null,
  pendingPromotionMove: null,
});

const findOpeningMove = (
  state: ChessRepertoireStore,
  openingMove: OpeningExplorerMove,
) => {
  const { chess } = state;

  return chess
    .moves({ verbose: true })
    .find((move) => move.san === openingMove.san);
};

const handleMove = (state: ChessRepertoireStore, pendingMove?: Move) => {
  const { chess } = state;

  if (!pendingMove) return state;

  if (pendingMove.flags.includes(CJ_PROMOTION_FLAG)) {
    // Hide pawn to indicate that the promotion is about to happen
    chess.remove(pendingMove.from);
    return {
      ...state,
      pendingPromotionMove: pendingMove,
      fen: chess.fen(),
    };
  }

  const nextMove = chess.move(pendingMove);

  if (nextMove) {
    return {
      ...state,
      lastMove: nextMove,
      fen: chess.fen(),
    };
  }

  return state;
};
