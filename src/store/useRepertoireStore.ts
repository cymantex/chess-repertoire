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
} from "@/external/chessops/pgn.ts";
import { findNextMoveBySan } from "@/external/chessjs/utils.ts";
import { CG_BLACK, CG_WHITE, CgColor } from "@/external/chessground/defs.tsx";
import { CJ_PROMOTION_FLAG } from "@/external/chessjs/defs.ts";
import {
  DEFAULT_POSITION_DATA,
  RepertoireMove,
  RepertoireOpeningExplorerMove,
  RepertoirePositionData,
} from "@/defs.ts";
import {
  deleteMove,
  getPositionData,
  upsertRepertoireMove,
} from "@/store/idbActions.ts";

type SetState = (
  partial:
    | Partial<ChessRepertoireStore>
    | ((
        state: ChessRepertoireStore,
      ) => Partial<ChessRepertoireStore> | ChessRepertoireStore)
    | ChessRepertoireStore,
  replace?: boolean | undefined,
) => void;

export interface ChessRepertoireStore {
  chess: Chess;

  // IDB
  currentRepertoirePositionData: RepertoirePositionData;
  getCurrentRepertoirePositionData: () => Promise<void>;
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    respectPrioritySettings?: boolean,
  ) => Promise<void>;
  deleteMove: (fen: string, san: string) => Promise<void>;

  // PGN
  pgn: Pgn;

  // Chessground
  orientation: CgColor;
  pendingPromotionMove: Move | null;
  rotate: () => void;
  handleChessgroundMove: (from: Key, to: Key) => Promise<void>;
  promote: (promotion: PieceSymbol) => Promise<void>;

  // Opening Explorer
  hoveredOpeningMove: Move | null;
  setHoveredOpeningMove: (
    openingMove: RepertoireOpeningExplorerMove | null,
  ) => void;
  handleOpeningExplorerMove: (
    openingMove: RepertoireOpeningExplorerMove,
  ) => void;

  // Navigation
  goToFirstMove: () => Promise<void>;
  goToPreviousMove: () => Promise<void>;
  goToNextMove: () => Promise<void>;
  goToLastMove: () => Promise<void>;
}

export const useRepertoireStore = create(
  devtools<ChessRepertoireStore>((set) => ({
    pgn: defaultPgn(),
    orientation: CG_WHITE,
    chess: new Chess(),
    hoveredOpeningMove: null,
    pendingPromotionMove: null,
    currentRepertoirePositionData: DEFAULT_POSITION_DATA,

    // IDB
    upsertMove: async (
      fen: string,
      repertoireMove: RepertoireMove,
      respectPrioritySettings = true,
    ) => {
      await upsertRepertoireMove(fen, repertoireMove, respectPrioritySettings);
      return updateCurrentRepertoirePositionData(set, fen);
    },
    deleteMove: async (fen: string, san: string) => {
      await deleteMove(fen, san);
      return updateCurrentRepertoirePositionData(set, fen);
    },
    getCurrentRepertoirePositionData: () =>
      withNonReactiveState(async (state) =>
        updateCurrentRepertoirePositionData(set, state.chess.fen()),
      ),

    // Chessground
    rotate: () =>
      set((state) => ({
        ...state,
        orientation: state.orientation === CG_WHITE ? CG_BLACK : CG_WHITE,
      })),
    promote: (promotion: PieceSymbol) =>
      withNonReactiveState((state) => {
        const { pendingPromotionMove, chess } = state;

        if (!pendingPromotionMove) return Promise.resolve();

        // Add back the pawn hidden before doing the promotion
        chess.put(
          { type: PAWN, color: chess.turn() },
          pendingPromotionMove.from,
        );
        const upsertPromise = upsertRepertoireMove(chess.fen(), {
          san: pendingPromotionMove.san,
        });
        addMoveToPgn(state.pgn, pendingPromotionMove.san, chess.history());
        chess.move({ ...pendingPromotionMove, promotion });

        return handlePositionStateChange({
          set,
          state,
          promisesToResolveBeforeUpdatingPositionData: [upsertPromise],
        });
      }),
    handleChessgroundMove: async (from: Key, to: Key) =>
      withNonReactiveState((state) => {
        const { chess } = state;

        const pendingMove = chess
          .moves({ verbose: true })
          .find((move) => move.from === from && move.to === to);

        return handleMove(set, state, pendingMove);
      }),

    // Opening Explorer
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

    // Navigation
    goToFirstMove: () =>
      withNonReactiveState((state) => {
        const { chess } = state;

        chess.reset();

        return handlePositionStateChange({ set, state });
      }),
    goToPreviousMove: async () =>
      withNonReactiveState((state) => {
        const { chess } = state;

        chess.undo();

        return handlePositionStateChange({ set, state });
      }),
    goToNextMove: async () =>
      withNonReactiveState((state) => {
        const { chess } = state;

        const nextMove = findNextMove(state.pgn, chess.history());

        if (nextMove) {
          chess.move(nextMove.data.san);
        } else {
          return Promise.resolve();
        }

        return handlePositionStateChange({ set, state });
      }),
    goToLastMove: async () =>
      withNonReactiveState((state) => {
        const { chess } = state;

        const remainingMainMoves = getRemainingMainMoves(
          state.pgn,
          chess.history(),
        );

        if (remainingMainMoves.length === 0) return Promise.resolve();

        remainingMainMoves.forEach((move) => chess.move(move));

        return handlePositionStateChange({ set, state });
      }),
  })),
);

const handlePositionStateChange = async ({
  set,
  state,
  newState,
  promisesToResolveBeforeUpdatingPositionData = [],
}: {
  set: SetState;
  state: ChessRepertoireStore;
  newState?: Partial<ChessRepertoireStore>;
  promisesToResolveBeforeUpdatingPositionData?: Promise<void>[];
}): Promise<void> => {
  const fen = state.chess.fen();

  // Update synchronous state early
  set({
    ...state,
    pgn: {
      ...state.pgn,
      fen,
    },
    hoveredOpeningMove: null,
    pendingPromotionMove: null,
    ...newState,
  });

  // IndexedDB related state can wait to be updated
  await Promise.all(promisesToResolveBeforeUpdatingPositionData);

  return updateCurrentRepertoirePositionData(set, state.chess.fen());
};

const updateCurrentRepertoirePositionData = async (
  set: SetState,
  fen: string,
) => {
  const data = await getPositionData(fen);
  set({ currentRepertoirePositionData: data });
};

const withNonReactiveState = (
  callback: (store: ChessRepertoireStore) => Promise<void>,
): Promise<void> =>
  callback(useRepertoireStore.getState() as ChessRepertoireStore);

const handleMove = async (
  set: SetState,
  state: ChessRepertoireStore,
  pendingMove?: Move,
): Promise<void> => {
  const { chess } = state;

  if (!pendingMove) return Promise.resolve();

  if (pendingMove.flags.includes(CJ_PROMOTION_FLAG)) {
    // Hide pawn to indicate that the promotion is about to happen
    chess.remove(pendingMove.from);
    return handlePositionStateChange({
      set,
      state,
      newState: { pendingPromotionMove: pendingMove },
    });
  }

  const upsertPromise = upsertRepertoireMove(chess.fen(), {
    san: pendingMove.san,
  });

  addMoveToPgn(state.pgn, pendingMove.san, chess.history());
  const nextMove = chess.move(pendingMove);

  if (nextMove) {
    return handlePositionStateChange({
      set,
      state,
      promisesToResolveBeforeUpdatingPositionData: [upsertPromise],
    });
  }
};

const findOpeningMove = (
  state: ChessRepertoireStore,
  openingMove: RepertoireOpeningExplorerMove,
) => {
  const { chess } = state;

  return findNextMoveBySan(chess, openingMove.san);
};
