import { isEqual } from "lodash";
import { getObject, upsertObject } from "local-storage-superjson";
import { useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  RepertoireSettings,
  SETTINGS_KEY,
} from "@/repertoire/defs.ts";

const subscribers = new Set<() => void>();

const notifySubscribers = () => subscribers.forEach((callback) => callback());

let currentSettings: RepertoireSettings = DEFAULT_SETTINGS;

export const localStorageStore = {
  subscribe: (callback: () => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
  getRepertoireSettingsSnapshot: (): RepertoireSettings => {
    const settings = getRepertoireSettings();

    if (isEqual(settings, currentSettings)) {
      return currentSettings;
    }

    currentSettings = settings;
    return settings;
  },
  upsertSettings: (settings: Partial<RepertoireSettings>) => {
    upsertObject<RepertoireSettings>(
      SETTINGS_KEY,
      { ...DEFAULT_SETTINGS, ...settings },
      (existingSettings) => ({
        ...existingSettings,
        ...settings,
      }),
    );
    notifySubscribers();
  },
};

export const getAnnotationSetting = () =>
  getRepertoireSettings().annotationSetting;

const getRepertoireSettings = () =>
  getObject<RepertoireSettings>(SETTINGS_KEY) ?? DEFAULT_SETTINGS;

export const useRepertoireSettings = () =>
  useSyncExternalStore(
    localStorageStore.subscribe,
    localStorageStore.getRepertoireSettingsSnapshot,
  );
