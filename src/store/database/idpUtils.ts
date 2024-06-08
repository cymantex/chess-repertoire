import { get, set } from "idb-keyval";

export const upsertObject = async <T>(
  key: string,
  valueIfMissing: T,
  onUpdate: (previousValue: T) => T,
) => {
  const existingValue = await get<T>(key);

  if (existingValue) {
    return set(key, onUpdate(existingValue));
  }

  return set(key, valueIfMissing);
};
