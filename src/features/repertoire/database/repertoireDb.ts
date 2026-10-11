import { type DBSchema, type IDBPDatabase, deleteDB, openDB } from "idb";
import {
  DEFAULT_DB_DISPLAY_NAME,
  isUserRepertoireDbName,
  toDisplayName,
  toRepertoireDbName,
} from "@/features/repertoire/database/utils.ts";
import { settingsDb } from "@/features/repertoire/database/settingsDb.ts";
import type { RepertoirePosition } from "@/features/repertoire/defs.ts";

export const REPERTOIRE_STORE_KEYS = {
  positions: "positions",
} as const;

export interface RepertoireDb extends DBSchema {
  [REPERTOIRE_STORE_KEYS.positions]: {
    key: string;
    value: RepertoirePosition;
  };
}

const connections = new Map<string, Promise<IDBPDatabase<RepertoireDb>>>();

export const openRepertoireDb = (dbName: string) => {
  const existing = connections.get(dbName);
  if (existing) return existing;

  const forgetConnection = () => {
    if (connections.get(dbName) === connection) connections.delete(dbName);
  };
  const connection = openDB<RepertoireDb>(dbName, 1, {
    upgrade: (db) =>
      Object.values(REPERTOIRE_STORE_KEYS).forEach((storeKey) => {
        db.createObjectStore(storeKey);
      }),
    blocking: () => {
      // Release the connection so another tab or worker can delete or upgrade it.
      void connection.then((db) => db.close());
      forgetConnection();
    },
    terminated: forgetConnection,
  });
  connections.set(dbName, connection);
  void connection.catch(forgetConnection);
  return connection;
};

export const repertoireDb = {
  create: async (dbDisplayName: string) => {
    await openRepertoireDb(toRepertoireDbName(dbDisplayName));
  },
  delete: async (dbDisplayName: string) => {
    if (
      dbDisplayName === (await settingsDb.getSelectedRepertoireDbDisplayName())
    ) {
      await settingsDb.setSelectedRepertoireDbName(DEFAULT_DB_DISPLAY_NAME);
    }

    return deleteDB(toRepertoireDbName(dbDisplayName));
  },
  listDisplayNames: async () => {
    const databases = await indexedDB.databases();

    const repertoireDbDisplayNames = databases
      .filter((db) => db.name)
      .map((db) => db.name!)
      .filter(isUserRepertoireDbName)
      .map(toDisplayName)
      .filter((name) => name !== DEFAULT_DB_DISPLAY_NAME);

    // The default database should always be displayed first
    return [DEFAULT_DB_DISPLAY_NAME, ...repertoireDbDisplayNames];
  },
};
