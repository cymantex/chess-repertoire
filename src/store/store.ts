import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chess, Move, PAWN } from "chess.js";
import { Key } from "chessground/types";
import {
  CG_BLACK,
  CG_WHITE,
  CJ_PROMOTION_FLAG,
} from "@/chessboard/constants.ts";
import { PieceSymbol } from "chess.js/src/chess.ts";

import { OpeningExplorerMove } from "@/sidebar/types.ts";
import { CgColor } from "@/chessboard/types.ts";
import { upsertRepertoireMove } from "@/repertoire-database/database.ts";
import { Pgn } from "@/pgn/types.ts";
import { addMoveToPgn, defaultPgn } from "@/pgn/pgn.ts";

export interface ChessRepertoireStore {
  chess: Chess;
  pgn: Pgn;

  // PGN / FEN
  setFenIfValid: (fen: string) => void;
  setPgnIfValid: (pgn: string) => void;

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

export const useChessRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    pgn: defaultPgn(),
    orientation: CG_WHITE,
    chess: new Chess(),
    hoveredOpeningMove: null,
    pendingPromotionMove: null,

    // Load PGN / FEN
    setPgnIfValid: (pgn) =>
      set((state) => {
        const { chess } = state;

        try {
          chess.loadPgn(pgn);
          return handlePositionStateChange(state);
        } catch (error) {
          return state;
        }
      }),
    setFenIfValid: (fen) =>
      set((state) => {
        const { chess } = state;

        try {
          chess.load(fen);
          return handlePositionStateChange(state);
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

        const nextMove = chess.history()[0];

        if (nextMove) {
          chess.move(nextMove);
        }

        return handlePositionStateChange(state);
      }),
    goToLastMove: () =>
      set((state) => {
        const { chess } = state;

        chess.history().forEach((move) => chess.move(move));

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

  upsertRepertoireMove(chess.fen(), { san: pendingMove.san });

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
    return {
      ...state,
      pgn: updateFen(state),
    };
  }

  return state;
};

const findOpeningMove = (
  state: ChessRepertoireStore,
  openingMove: OpeningExplorerMove,
) => {
  const { chess } = state;

  return chess
    .moves({ verbose: true })
    .find((move) => move.san === openingMove.san);
};