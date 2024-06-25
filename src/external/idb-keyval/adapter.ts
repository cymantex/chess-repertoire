import { clear, entries, get, setMany, update } from "idb-keyval";

import {
  DEFAULT_DB,
  determineSelectedDb,
  getSelectedDbName,
  getSelectedStore,
  persistSelectedStore,
} from "./selectedStore.ts";
import {
  createOrGet,
  DEFAULT_DB_DISPLAY_NAME,
  isUserRepertoireDbName,
  resetHalfMoveClock,
  toDisplayName,
  toStoreName,
} from "./utils.ts";

export const idbUpsert = async <T>(
  fen: string,
  valueIfMissing: T,
  onUpdate: (previousValue: T) => T,
) =>
  update<T>(
    resetHalfMoveClock(fen),
    (previousValue) => {
      if (previousValue) {
        return onUpdate(previousValue);
      }

      return valueIfMissing;
    },
    await getSelectedStore(),
  );

export const idbGet = async <T>(fen: string) =>
  get<T>(resetHalfMoveClock(fen), await getSelectedStore());

export const idbEntries = async <TValue>() =>
  entries<string, TValue>(await getSelectedStore());

export const idbSetEntries = async <TValue>(entries: [string, TValue][]) =>
  setMany(entries, await getSelectedStore());

export const idbClear = async () => clear(await getSelectedStore());

export const idbCreateDatabase = async (dbName?: string) => {
  if (dbName) {
    createOrGet(dbName);
  }
};

export const idbSelectDb = async (dbName?: string): Promise<void> =>
  determineSelectedDb({
    selectedDbName: dbName,
    onDefaultDbSelected: () => persistSelectedStore(DEFAULT_DB),
    onCustomDbSelected: (dbName) => persistSelectedStore(dbName),
  });

export const idbGetSelectedDbDisplayName = async (): Promise<string> =>
  determineSelectedDb({
    selectedDbName: await getSelectedDbName(),
    onDefaultDbSelected: () => DEFAULT_DB_DISPLAY_NAME,
    onCustomDbSelected: (dbName) => toDisplayName(dbName),
  });

export const idbDeleteDatabase = async (dbName?: string): Promise<void> => {
  if (!dbName) return;

  await handleIsSelectedStore(dbName, async (store) => {
    await idbSelectDb();
    store.transaction.db.close();
  });

  const request = indexedDB.deleteDatabase(dbName);

  return new Promise<void>((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = (error) => reject(error);
    request.onblocked = (error) => {
      console.error(
        "Database deletion blocked, checking if database is still removed",
        error,
      );

      idbListDbNames()
        .then((dbNames) => {
          const databaseRemoved = !dbNames.includes(dbName);

          if (databaseRemoved) {
            console.log("Database is removed, resolving");
            return resolve();
          } else {
            reject(
              new Error(
                "Database deletion reported as blocked, try reloading the " +
                  "page and redo the operation if necessary",
              ),
            );
          }
        })
        .catch(reject);
    };
    request.onupgradeneeded = (event) => reject(event);
  }).catch((error) => {
    console.error("Error deleting database", error);
    throw error;
  });
};

export const idbListUserRepertoireDbDisplayNames = async (): Promise<
  string[]
> => {
  const databaseNames = await idbListDbNames();
  return [
    DEFAULT_DB_DISPLAY_NAME,
    ...databaseNames.filter(isUserRepertoireDbName).map(toDisplayName),
  ];
};

const idbListDbNames = async (): Promise<string[]> => {
  const databases = await indexedDB.databases();
  return databases.filter((db) => db.name).map((db) => db.name!);
};

const handleIsSelectedStore = async (
  dbName: string,
  onIsSelectedStore: (store: IDBObjectStore) => unknown,
) => {
  const selectedStore = await getSelectedStore();

  if (selectedStore) {
    await selectedStore("readonly", (store) => {
      if (store.name === toStoreName(dbName)) {
        onIsSelectedStore(store);
      }
    });
  }
};
