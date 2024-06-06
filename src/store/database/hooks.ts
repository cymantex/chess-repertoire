import { useSyncExternalStore } from "react";
import { repertoireDatabaseStore } from "@/store/database/repertoireDatabaseStore.ts";
import { RepertoirePositionData } from "@/defs.ts";

export const useDatabasePositionComment = (fen: string) =>
  useDatabasePositionData(fen)?.comment ?? "";

export const useDatabasePositionMoves = (fen: string) =>
  useDatabasePositionData(fen)?.moves ?? [];

const useDatabasePositionData = (fen: string) => {
  return useSyncExternalStore<RepertoirePositionData>(
    repertoireDatabaseStore.subscribe,
    () => repertoireDatabaseStore.getSnapshot(fen),
  );
};
