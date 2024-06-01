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
  handleRotate: () => void;
  hoveredOpeningMove: Move | null;
  pendingPromotionMove: Move | null;
  setHoveredMove: (openingMove: OpeningExplorerMove | null) => void;
  handleChessgroundMove: (from: Key, to: Key) => void;
  handleOpeningExplorerMove: (openingMove: OpeningExplorerMove) => void;
  handlePromotion: (promotion: PieceSymbol) => void;
  handleUndoLastMove: () => void;
}

export const useChessRepertoireStore = create<ChessRepertoireStore>((set) => ({
  orientation: CG_WHITE,
  chess: globalChess,
  fen: startingPositionFen,
  lastMove: null,
  hoveredOpeningMove: null,
  pendingPromotionMove: null,
  handleRotate: () =>
    set((state) => ({
      ...state,
      orientation: state.orientation === CG_WHITE ? CG_BLACK : CG_WHITE,
    })),
  setHoveredMove: (openingMove) =>
    set((state) => {
      return {
        ...state,
        hoveredOpeningMove:
          openingMove === null ? null : findOpeningMove(state, openingMove),
      };
    }),
  handlePromotion: (promotion: PieceSymbol) =>
    set((state) => {
      const { pendingPromotionMove, chess } = state;

      if (!pendingPromotionMove) return state;

      // Add back the pawn hidden before doing the promotion
      chess.put({ type: PAWN, color: chess.turn() }, pendingPromotionMove.from);
      chess.move({ ...pendingPromotionMove, promotion });

      return {
        ...state,
        lastMove: pendingPromotionMove,
        pendingPromotionMove: null,
        fen: chess.fen(),
      };
    }),
  handleOpeningExplorerMove: (openingMove: OpeningExplorerMove) =>
    set((state) => handleMove(state, findOpeningMove(state, openingMove))),
  handleChessgroundMove: (from: Key, to: Key) =>
    set((state) => {
      const { chess } = state;

      const pendingMove = chess
        .moves({ verbose: true })
        .find((move) => move.from === from && move.to === to);

      return handleMove(state, pendingMove);
    }),
  handleUndoLastMove: () =>
    set((state) => {
      const { chess } = state;

      chess.undo();

      return {
        ...state,
        lastMove: null,
        fen: chess.fen(),
      };
    }),
}));

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
