import {
  deleteRepertoireMove,
  setRepertoirePositionShapes,
  upsertRepertoireMove,
} from "@/features/repertoire/repository.ts";
import {
  getNonReactiveState,
  updateCurrentRepertoirePosition,
} from "@/app/zustand/utils.ts";
import type {
  RepertoireMove,
  RepertoirePosition,
} from "@/features/repertoire/defs.ts";
import { DEFAULT_REPERTOIRE_POSITION } from "@/features/repertoire/defs.ts";
import type { AnnotationSetting } from "@/features/annotations/defs.ts";
import type { DrawShape } from "chessground/draw";
import type { ChessRepertoireStore, SetState } from "@/app/zustand/store.ts";
import { selectFen } from "@/app/zustand/store.ts";
import { repertoireDb } from "@/features/repertoire/database/repertoireDb.ts";
import { settingsDb } from "@/features/repertoire/database/settingsDb.ts";

export interface RepertoireSlice {
  databases: string[];
  selectedDatabase?: string;
  selectDatabase: (dbDisplayName: string) => Promise<void>;
  createDatabase: (dbDisplayName: string) => Promise<void>;
  listDatabases: () => Promise<void>;
  fetchingRepertoirePosition: boolean;
  currentRepertoirePosition: RepertoirePosition;
  getCurrentRepertoirePosition: () => Promise<void>;
  upsertMove: (
    fen: string,
    repertoireMove: RepertoireMove,
    annotationSetting: AnnotationSetting,
  ) => Promise<void>;
  deleteMove: (fen: string, san: string) => Promise<void>;
  setShapes: (shapes: DrawShape[]) => Promise<void>;
}

export const createRepertoireSlice = (set: SetState): RepertoireSlice => ({
  currentRepertoirePosition: DEFAULT_REPERTOIRE_POSITION,
  selectedDatabase: undefined,
  databases: [],
  fetchingRepertoirePosition: false,

  selectDatabase: async (dbDisplayName) => {
    await settingsDb.setSelectedRepertoireDbName(dbDisplayName);
    await getCurrentRepertoirePosition(set);
    set({ selectedDatabase: dbDisplayName });
  },
  createDatabase: async (dbDisplayName) => {
    await repertoireDb.create(dbDisplayName);
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
  const selectedDatabase =
    await settingsDb.getSelectedRepertoireDbDisplayName();
  const databases = await repertoireDb.listDisplayNames();
  set({
    selectedDatabase,
    databases,
  });
};

export const selectDatabases = (state: ChessRepertoireStore) => state.databases;
export const selectSelectedDatabase = (state: ChessRepertoireStore) =>
  state.selectedDatabase;
export const selectSelectDatabase = (state: ChessRepertoireStore) =>
  state.selectDatabase;
export const selectCreateDatabase = (state: ChessRepertoireStore) =>
  state.createDatabase;
export const selectListDatabases = (state: ChessRepertoireStore) =>
  state.listDatabases;
export const selectUpsertMove = (state: ChessRepertoireStore) =>
  state.upsertMove;
export const selectDeleteMove = (state: ChessRepertoireStore) =>
  state.deleteMove;
export const selectSetShapes = (state: ChessRepertoireStore) => state.setShapes;
export const selectGetCurrentRepertoirePosition = (
  state: ChessRepertoireStore,
) => state.getCurrentRepertoirePosition;
export const selectFetchingRepertoirePosition = (state: ChessRepertoireStore) =>
  state.fetchingRepertoirePosition;
export const selectCurrentRepertoirePositionComments = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePosition?.comments;
export const selectCurrentRepertoirePositionMoves = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePosition?.moves;
export const selectCurrentRepertoirePositionShapes = (
  state: ChessRepertoireStore,
) => state.currentRepertoirePosition?.shapes;
