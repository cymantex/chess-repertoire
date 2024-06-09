import {
  deleteRepertoireMove,
  setRepertoirePositionShapes,
  upsertRepertoireMove,
} from "@/store/repertoireRepository.ts";
import {
  getNonReactiveState,
  updateCurrentRepertoirePosition,
} from "@/store/zustand/utils.ts";
import { RepertoireSlice, SetState } from "@/store/zustand/defs.ts";
import { DEFAULT_REPERTOIRE_POSITION } from "@/defs.ts";
import { selectFen } from "@/store/zustand/selectors.ts";

export const createRepertoireSlice = (set: SetState): RepertoireSlice => ({
  currentRepertoirePosition: DEFAULT_REPERTOIRE_POSITION,

  setShapes: async (shapes) => {
    const fen = selectFen(getNonReactiveState());
    await setRepertoirePositionShapes(fen, shapes);
    return updateCurrentRepertoirePosition(set, fen);
  },
  upsertMove: async (fen, repertoireMove, prioritySetting) => {
    await upsertRepertoireMove(fen, repertoireMove, prioritySetting);
    return updateCurrentRepertoirePosition(set, fen);
  },
  deleteMove: async (fen, san) => {
    await deleteRepertoireMove(fen, san);
    return updateCurrentRepertoirePosition(set, fen);
  },
  getCurrentRepertoirePosition: () =>
    updateCurrentRepertoirePosition(set, selectFen(getNonReactiveState())),
});
