import { isEqual } from "lodash";
import { DEFAULT_SETTINGS, RepertoireSettings, SETTINGS_KEY } from "@/defs.ts";
import { getObject, upsertObject } from "local-storage-superjson";

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
  upsertSettings: (settings: RepertoireSettings) => {
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

export const getRepertoireSettings = () =>
  getObject<RepertoireSettings>(SETTINGS_KEY) ?? DEFAULT_SETTINGS;
