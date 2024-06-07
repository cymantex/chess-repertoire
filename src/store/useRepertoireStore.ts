import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess, Move, PAWN } from "chess.js";
import { Key } from "chessground/types";
import { PieceSymbol } from "chess.js/src/chess.ts";

import { Pgn } from "@/external/chessops/defs.ts";
import {
  addMoveToPgn,
  defaultPgn,
  findNextMove,
  getRemainingMainMoves,
} from "@/external/chessops/pgn/pgn.ts";
import { repertoireDatabaseStore } from "@/store/database/repertoireDatabaseStore.ts";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";
import { CG_BLACK, CG_WHITE, CgColor } from "@/external/chessground/defs.tsx";
import { CJ_PROMOTION_FLAG } from "@/external/chessjs/defs.ts";
import { OpeningExplorerMove } from "@/defs.ts";

export interface ChessRepertoireStore {
  chess: Chess;

  // PGN
  pgn: Pgn;

  // Chessground
  orientation: CgColor;
  pendingPromotionMove: Move | null;
  rotate: () => void;
  handleChessgroundMove: (from: Key, to: Key) => void;
  promote: (promotion: PieceSymbol) => void;

  // Opening Explorer
  hoveredOpeningMove: Move | null;
  setHoveredOpeningMove: (openingMove: OpeningExplorerMove | null) => void;
  handleOpeningExplorerMove: (openingMove: OpeningExplorerMove) => void;

  // Navigation
  goToFirstMove: () => void;
  goToPreviousMove: () => void;
  goToNextMove: () => void;
  goToLastMove: () => void;
}

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    pgn: defaultPgn(),
    orientation: CG_WHITE,
    chess: new Chess(),
    hoveredOpeningMove: null,
    pendingPromotionMove: null,

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
        chess.put(
          { type: PAWN, color: chess.turn() },
          pendingPromotionMove.from,
        );
        addMoveToPgn(state.pgn, pendingPromotionMove.san, chess.history());
        chess.move({ ...pendingPromotionMove, promotion });

        return handlePositionStateChange(state);
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

        return handlePositionStateChange(state);
      }),
    goToPreviousMove: () =>
      set((state) => {
        const { chess } = state;

        chess.undo();

        return handlePositionStateChange(state);
      }),
    goToNextMove: () =>
      set((state) => {
        const { chess } = state;

        const nextMove = findNextMove(state.pgn, chess.history());

        if (nextMove) {
          chess.move(nextMove.data.san);
        } else {
          return state;
        }

        return handlePositionStateChange(state);
      }),
    goToLastMove: () =>
      set((state) => {
        const { chess } = state;

        const remainingMainMoves = getRemainingMainMoves(
          state.pgn,
          chess.history(),
        );

        if (remainingMainMoves.length === 0) return state;

        remainingMainMoves.forEach((move) => chess.move(move));

        return handlePositionStateChange(state);
      }),
  })),
);

const handlePositionStateChange = (state: ChessRepertoireStore) => ({
  ...state,
  pgn: updateFen(state),
  hoveredOpeningMove: null,
  pendingPromotionMove: null,
});

const updateFen = (state: ChessRepertoireStore) => ({
  ...state.pgn,
  fen: state.chess.fen(),
});

const handleMove = (state: ChessRepertoireStore, pendingMove?: Move) => {
  const { chess } = state;

  if (!pendingMove) return state;

  repertoireDatabaseStore.upsertMove(chess.fen(), { san: pendingMove.san });

  if (pendingMove.flags.includes(CJ_PROMOTION_FLAG)) {
    // Hide pawn to indicate that the promotion is about to happen
    chess.remove(pendingMove.from);
    return {
      ...state,
      pendingPromotionMove: pendingMove,
      pgn: updateFen(state),
    };
  }

  addMoveToPgn(state.pgn, pendingMove.san, chess.history());
  const nextMove = chess.move(pendingMove);

  if (nextMove) {
    return handlePositionStateChange(state);
  }

  return state;
};

const findOpeningMove = (
  state: ChessRepertoireStore,
  openingMove: OpeningExplorerMove,
) => {
  const { chess } = state;

  return findNextMoveBySan(chess, openingMove.san);
};
