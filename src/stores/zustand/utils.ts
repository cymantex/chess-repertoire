import {
  getRepertoirePosition,
  upsertRepertoireMove,
} from "@/repertoire/repository.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { ChessRepertoireStore, SetState } from "@/stores/zustand/defs.ts";
import { Move } from "chess.js";
import { CJ_PROMOTION_FLAG } from "@/external/chessjs/defs.ts";
import { getAnnotationSetting } from "@/stores/repertoireSettingsStore.ts";
import { addMoveToPgn } from "@/external/chessops/pgn.ts";

import { DEFAULT_REPERTOIRE_POSITION } from "@/repertoire/defs.ts";
import { PGN_HEADERS } from "@/defs.ts";

/**
 * This function should always be called whenever a change in the position (FEN)
 * occurs.
 */
export const handlePositionStateChange = async ({
  set,
  newState,
  promisesToResolveBeforeUpdatingRepertoirePosition = [],
}: {
  set: SetState;
  newState?: Partial<ChessRepertoireStore>;
  promisesToResolveBeforeUpdatingRepertoirePosition?: Promise<void>[];
}): Promise<void> => {
  const state = getNonReactiveState();

  // Update synchronous state early
  set({
    ...state,
    fen: state.chess.fen(),
    currentRepertoirePosition: DEFAULT_REPERTOIRE_POSITION,
    hoveredOpeningMove: null,
    pendingPromotionMove: null,
    ...newState,
  });

  // Repository related async state can wait to be updated
  await Promise.all(promisesToResolveBeforeUpdatingRepertoirePosition);

  return updateCurrentRepertoirePosition(set, state.chess.fen());
};

export const resetGame = () => {
  const { chess, pgn } = getNonReactiveState();

  if (pgn.headers.has(PGN_HEADERS.FEN)) {
    chess.load(pgn.headers.get(PGN_HEADERS.FEN)!);
  } else {
    chess.reset();
  }
};

export const updateCurrentRepertoirePosition = async (
  set: SetState,
  fen: string,
) => {
  set({ fetchingRepertoirePosition: true });
  const data = await getRepertoirePosition(fen);
  set({
    fetchingRepertoirePosition: false,
    currentRepertoirePosition: data,
  });
};

export const handleMove = async (
  set: SetState,
  pendingMove?: Move,
): Promise<void> => {
  const state = getNonReactiveState();
  const { chess } = state;

  if (!pendingMove) return Promise.resolve();

  if (pendingMove.flags.includes(CJ_PROMOTION_FLAG)) {
    // Hide pawn to indicate that the promotion is about to happen
    chess.remove(pendingMove.from);
    return handlePositionStateChange({
      set,
      newState: { pendingPromotionMove: pendingMove },
    });
  }

  const upsertPromise = upsertRepertoireMove(
    chess.fen(),
    {
      san: pendingMove.san,
    },
    getAnnotationSetting(),
  );

  addMoveToPgn(state.pgn, pendingMove.san, chess.history());
  const nextMove = chess.move(pendingMove);

  if (nextMove) {
    return handlePositionStateChange({
      set,
      promisesToResolveBeforeUpdatingRepertoirePosition: [upsertPromise],
    });
  }
};

export const getNonReactiveState = (): ChessRepertoireStore =>
  useRepertoireStore.getState() as ChessRepertoireStore;
