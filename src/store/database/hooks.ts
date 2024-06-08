import { useSyncExternalStore } from "react";
import { localStorageStore } from "@/store/database/localStorageStore.ts";

export const useRepertoireSettings = () =>
  useSyncExternalStore(
    localStorageStore.subscribe,
    localStorageStore.getRepertoireSettingsSnapshot,
  );
