import { isEqual } from "lodash";
import { getObject, setObject, upsertObject } from "local-storage-superjson";
import { useSyncExternalStore } from "react";
import {
  DEFAULT_SETTINGS,
  EngineSettings,
  RepertoireSettings,
  SETTINGS_KEY,
  ToggleSection,
  ToggleState,
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
  upsertSections: (section: ToggleSection, state: ToggleState) => {
    _upsertSettings((prevSettings) => ({
      sections: {
        ...DEFAULT_SETTINGS.sections,
        ...prevSettings.sections,
        [section]: state,
      },
    }));
    notifySubscribers();
  },
  upsertEngineSettings: (settings: Partial<EngineSettings>) => {
    _upsertSettings((prevSettings) => ({
      engineSettings: {
        ...DEFAULT_SETTINGS.engineSettings,
        ...prevSettings.engineSettings,
        ...settings,
      },
    }));
    notifySubscribers();
  },
  upsertSettings: (settings: Partial<RepertoireSettings>) => {
    _upsertSettings(() => settings);
    notifySubscribers();
  },
};

const _upsertSettings = (
  update: (prevSettings: RepertoireSettings) => Partial<RepertoireSettings>,
) => {
  upsertObject<RepertoireSettings>(
    SETTINGS_KEY,
    { ...DEFAULT_SETTINGS, ...update(DEFAULT_SETTINGS) },
    (existingSettings) => ({
      ...DEFAULT_SETTINGS,
      ...existingSettings,
      ...update(existingSettings),
    }),
  );
};

export const getAnnotationSetting = () =>
  getRepertoireSettings().annotationSetting;

export const getRepertoireSettings = () => {
  const settings = getObject<RepertoireSettings>(SETTINGS_KEY);

  if (!settings) {
    setObject(SETTINGS_KEY, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
  };
};

export const useRepertoireSettings = () =>
  useSyncExternalStore(
    localStorageStore.subscribe,
    localStorageStore.getRepertoireSettingsSnapshot,
  );
