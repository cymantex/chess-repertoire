import { get, set, UseStore } from "idb-keyval";
import { createOrGet } from "./utils.ts";

const SELECTED_DB_KEY = "selectedRepertoireDb";
const SETTINGS_STORE = createOrGet("repertoire-settings");

// undefined means the default store from idp-keyval is used
export const DEFAULT_DB = undefined;

let selectedStoreInitialized = false;
let selectedStore: UseStore | typeof DEFAULT_DB = DEFAULT_DB;

const selectStore = (store?: UseStore) => {
  selectedStore = store;
  selectedStoreInitialized = true;
  return selectedStore;
};

export const getSelectedDbName = async () =>
  await get(SELECTED_DB_KEY, SETTINGS_STORE);

export const persistSelectedStore = async (dbName: string | undefined) => {
  if (!dbName) {
    await set(SELECTED_DB_KEY, DEFAULT_DB, SETTINGS_STORE);
    selectStore(DEFAULT_DB);
    return;
  }

  const store = createOrGet(dbName);
  await set(SELECTED_DB_KEY, dbName, SETTINGS_STORE);
  selectStore(store);
};

export const getSelectedStore = async () => {
  if (selectedStoreInitialized) {
    return selectedStore;
  }

  return determineSelectedDb({
    selectedDbName: await getSelectedDbName(),
    onDefaultDbSelected: () => selectStore(DEFAULT_DB),
    onCustomDbSelected: (dbName) => selectStore(createOrGet(dbName)),
  });
};

export const determineSelectedDb = async <T>({
  selectedDbName,
  onDefaultDbSelected,
  onCustomDbSelected,
}: {
  selectedDbName: string | undefined;
  onDefaultDbSelected: () => T;
  onCustomDbSelected: (dbName: string) => T;
}) => {
  if (!selectedDbName) {
    return onDefaultDbSelected();
  }

  const databaseExists = await isExistingDatabase(selectedDbName);

  if (!databaseExists) {
    return onDefaultDbSelected();
  }

  return onCustomDbSelected(selectedDbName);
};

const isExistingDatabase = async (dbName: string): Promise<boolean> => {
  const databases = await indexedDB.databases();
  return databases.some((db) => db.name === dbName);
};
