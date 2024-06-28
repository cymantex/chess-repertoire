import {
  deleteRepertoireMove,
  setRepertoirePositionShapes,
  upsertRepertoireMove,
} from "@/repertoire/repertoireRepository.ts";
import {
  getNonReactiveState,
  updateCurrentRepertoirePosition,
} from "@/stores/zustand/utils.ts";
import { RepertoireSlice, SetState } from "@/stores/zustand/defs.ts";
import { selectFen } from "@/stores/zustand/selectors.ts";
import { DEFAULT_REPERTOIRE_POSITION } from "@/repertoire/defs.ts";
import {
  idbCreateDatabase,
  idbGetSelectedDbDisplayName,
  idbListUserRepertoireDbDisplayNames,
  idbSelectDb,
} from "@/external/idb-keyval/adapter.ts";
import { toDbName } from "@/external/idb-keyval/utils.ts";

export const createRepertoireSlice = (set: SetState): RepertoireSlice => ({
  currentRepertoirePosition: DEFAULT_REPERTOIRE_POSITION,
  selectedDatabase: undefined,
  databases: [],
  fetchingRepertoirePosition: false,

  selectDatabase: async (dbDisplayName) => {
    await idbSelectDb(toDbName(dbDisplayName));
    await getCurrentRepertoirePosition(set);
    set({ selectedDatabase: dbDisplayName });
  },
  createDatabase: async (dbDisplayName) => {
    await idbCreateDatabase(toDbName(dbDisplayName));
    await listDatabases(set);
    await getCurrentRepertoirePosition(set);
  },
  listDatabases: async () => listDatabases(set),
  setShapes: async (shapes) => {
    const fen = selectFen(getNonReactiveState());
    await setRepertoirePositionShapes(fen, shapes);
    return updateCurrentRepertoirePosition(set, fen);
  },
  upsertMove: async (fen, repertoireMove, annotationSetting) => {
    await upsertRepertoireMove(fen, repertoireMove, annotationSetting);
    return updateCurrentRepertoirePosition(set, fen);
  },
  deleteMove: async (fen, san) => {
    await deleteRepertoireMove(fen, san);
    return updateCurrentRepertoirePosition(set, fen);
  },
  getCurrentRepertoirePosition: () => getCurrentRepertoirePosition(set),
});

const getCurrentRepertoirePosition = async (set: SetState) =>
  updateCurrentRepertoirePosition(set, selectFen(getNonReactiveState()));

const listDatabases = async (set: SetState) => {
  const selectedDatabase = await idbGetSelectedDbDisplayName();
  const databases = await idbListUserRepertoireDbDisplayNames();
  set({
    selectedDatabase,
    databases,
  });
};
