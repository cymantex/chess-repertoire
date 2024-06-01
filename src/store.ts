import { create } from "zustand";
import { Chess, Move, PAWN } from "chess.js";
import { Key } from "chessground/types";
import { CJ_PROMOTION_FLAG } from "@/chessboard/constants.ts";
import { PieceSymbol } from "chess.js/src/chess.ts";
import { OpeningExplorerMove } from "@/opening-explorer/OpeningExplorer.tsx";

const globalChess = new Chess();
const startingPositionFen = globalChess.fen();

interface ChessRepertoireStore {
  chess: Chess;
  fen: string;
  lastMove: Move | null;
  pendingPromotionMove: Move | null;
  handleChessgroundMove: (from: Key, to: Key) => void;
  handleOpeningExplorerMove: (openingMove: OpeningExplorerMove) => void;
  handlePromotion: (promotion: PieceSymbol) => void;
}

export const useChessRepertoireStore = create<ChessRepertoireStore>((set) => ({
  chess: globalChess,
  fen: startingPositionFen,
  lastMove: null,
  pendingPromotionMove: null,
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
    set((state) => {
      const { chess } = state;

      const pendingMove = chess
        .moves({ verbose: true })
        .find((move) => move.san === openingMove.san);

      return handleMove(state, pendingMove);
    }),
  handleChessgroundMove: (from: Key, to: Key) =>
    set((state) => {
      const { chess } = state;

      const pendingMove = chess
        .moves({ verbose: true })
        .find((move) => move.from === from && move.to === to);

      return handleMove(state, pendingMove);
    }),
}));

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
