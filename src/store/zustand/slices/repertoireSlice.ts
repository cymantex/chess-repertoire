import {
  deleteMove,
  setRepertoireShapes,
  upsertRepertoireMove,
} from "@/store/repertoireRepository.ts";
import {
  updateCurrentRepertoirePositionData,
  withNonReactiveState,
} from "@/store/zustand/utils.ts";
import { RepertoireSlice, SetState } from "@/store/zustand/defs.ts";
import { DEFAULT_POSITION_DATA } from "@/defs.ts";

export const createRepertoireSlice = (set: SetState): RepertoireSlice => ({
  currentRepertoirePositionData: DEFAULT_POSITION_DATA,

  setShapes: async (shapes) =>
    withNonReactiveState(async (state) => {
      const { chess } = state;
      const fen = chess.fen();
      await setRepertoireShapes(fen, shapes);
      return updateCurrentRepertoirePositionData(set, fen);
    }),
  upsertMove: async (fen, repertoireMove, prioritySetting) => {
    await upsertRepertoireMove(fen, repertoireMove, prioritySetting);
    return updateCurrentRepertoirePositionData(set, fen);
  },
  deleteMove: async (fen, san) => {
    await deleteMove(fen, san);
    return updateCurrentRepertoirePositionData(set, fen);
  },
  getCurrentRepertoirePositionData: () =>
    withNonReactiveState(async (state) =>
      updateCurrentRepertoirePositionData(set, state.chess.fen()),
    ),
});
