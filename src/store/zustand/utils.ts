import {
  getPositionData,
  upsertRepertoireMove,
} from "@/store/repertoireRepository.ts";
import { useRepertoireStore } from "@/store/zustand/useRepertoireStore.ts";
import { ChessRepertoireStore, SetState } from "@/store/zustand/defs.ts";
import { Move } from "chess.js";
import { CJ_PROMOTION_FLAG } from "@/external/chessjs/defs.ts";
import { getPrioritySetting } from "@/store/localStorageStore.ts";
import { addMoveToPgn } from "@/external/chessops/pgn.ts";

/**
 * This function should always be called whenever a change in the position (FEN)
 * occurs.
 */
export const handlePositionStateChange = async ({
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

  // Repository related async state can wait to be updated
  await Promise.all(promisesToResolveBeforeUpdatingPositionData);

  return updateCurrentRepertoirePositionData(set, state.chess.fen());
};

export const updateCurrentRepertoirePositionData = async (
  set: SetState,
  fen: string,
) => {
  const data = await getPositionData(fen);
  set({ currentRepertoirePositionData: data });
};

export const handleMove = async (
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

  const upsertPromise = upsertRepertoireMove(
    chess.fen(),
    {
      san: pendingMove.san,
    },
    getPrioritySetting(),
  );

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

export const withNonReactiveState = (
  callback: (store: ChessRepertoireStore) => Promise<void>,
): Promise<void> =>
  callback(useRepertoireStore.getState() as ChessRepertoireStore);
