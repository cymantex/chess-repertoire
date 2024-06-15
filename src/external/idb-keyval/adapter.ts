import { entries, get, setMany, update } from "idb-keyval";

export const idbUpsert = async <T>(
  key: string,
  valueIfMissing: T,
  onUpdate: (previousValue: T) => T,
) =>
  update<T>(key, (previousValue) => {
    if (previousValue) {
      return onUpdate(previousValue);
    }

    return valueIfMissing;
  });

export const idbGet = async <T>(key: string) => get<T>(key);

export const idpEntries = async <TKey extends IDBValidKey, TValue>() =>
  entries<TKey, TValue>();

export const idpSetEntries = async <TKey extends IDBValidKey, TValue>(
  entries: [TKey, TValue][],
) => setMany(entries);
