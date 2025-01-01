// TODO: localStorage not available in worker
import { type DBSchema, openDB } from "idb";
import {
  DEFAULT_DB_DISPLAY_NAME,
  toDisplayName,
  toRepertoireDbName,
} from "@/features/repertoire/database/utils.ts";

const SELECTED_REPERTOIRE_DB_KEY = "selectedRepertoireDb";
const SETTINGS_DB_NAME = "settings";

interface SettingsDb extends DBSchema {
  settings: {
    key: typeof SELECTED_REPERTOIRE_DB_KEY;
    value: string;
  };
}

// localStorage is unfortunately not available in a worker which is why
// IndexedDB is used here to store the selected repertoire database.
let selectedRepertoireDbName: string | null = null;

const openSettingsDb = async () =>
  await openDB<SettingsDb>(SETTINGS_DB_NAME, 1, {
    upgrade: (db) => db.createObjectStore(SETTINGS_DB_NAME),
  });

export const getSelectedRepertoireDbName = async () => {
  if (selectedRepertoireDbName) return selectedRepertoireDbName;
  const db = await openSettingsDb();

  const selected = await db.get(SETTINGS_DB_NAME, SELECTED_REPERTOIRE_DB_KEY);

  if (!selected) {
    await setSelectedRepertoireDbName(DEFAULT_DB_DISPLAY_NAME);
    selectedRepertoireDbName = toRepertoireDbName(DEFAULT_DB_DISPLAY_NAME);
  } else {
    selectedRepertoireDbName = selected;
  }
  return selectedRepertoireDbName;
};

export const setSelectedRepertoireDbName = async (dbDisplayName: string) => {
  selectedRepertoireDbName = toRepertoireDbName(dbDisplayName);
  const db = await openSettingsDb();

  await db.put(
    SETTINGS_DB_NAME,
    selectedRepertoireDbName,
    SELECTED_REPERTOIRE_DB_KEY,
  );
};

export const settingsDb = {
  getSelectedRepertoireDbName,
  setSelectedRepertoireDbName,
  getSelectedRepertoireDbDisplayName: async () => {
    const selectedDb = await getSelectedRepertoireDbName();
    return toDisplayName(selectedDb);
  },
};
