import { useSyncExternalStore } from "react";
import { localStorageStore } from "@/store/database/localStorageStore.ts";
import { RepertoirePositionData } from "@/defs.ts";

export const useDatabasePositionComment = (fen: string) =>
  useDatabasePositionData(fen)?.comment ?? "";

export const useDatabasePositionMoves = (fen: string) =>
  useDatabasePositionData(fen)?.moves ?? [];

export const useRepertoireSettings = () =>
  useSyncExternalStore(
    localStorageStore.subscribe,
    localStorageStore.getRepertoireSettingsSnapshot,
  );

const useDatabasePositionData = (fen: string) => {
  return useSyncExternalStore<RepertoirePositionData>(
    localStorageStore.subscribe,
    () => localStorageStore.getPositionDataSnapshot(fen),
  );
};
