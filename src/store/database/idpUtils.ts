import { update } from "idb-keyval";

export const upsertIdbObject = async <T>(
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
