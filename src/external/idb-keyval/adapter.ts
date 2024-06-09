import { get, update } from "idb-keyval";

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
