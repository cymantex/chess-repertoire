import { settingsDb } from "@/features/repertoire/database/settingsDb.ts";
import { resetHalfMoveClock } from "@/features/repertoire/database/utils.ts";
import type { RepertoirePosition } from "@/features/repertoire/defs.ts";
import {
  openRepertoireDb,
  REPERTOIRE_STORE_KEYS,
} from "@/features/repertoire/database/repertoireDb.ts";

const startTransaction = async () => {
  const db = await openRepertoireDb(
    await settingsDb.getSelectedRepertoireDbName(),
  );
  const tx = db.transaction(REPERTOIRE_STORE_KEYS.positions, "readwrite");
  const store = tx.objectStore(REPERTOIRE_STORE_KEYS.positions);
  return { db, tx, store };
};

export const positionsStore = {
  get: async (fen: string) => {
    const { store, tx } = await startTransaction();
    const position = await store.get(resetHalfMoveClock(fen));
    await tx.done;

    return position;
  },
  upsert: async (
    fen: string,
    valueIfMissing: RepertoirePosition,
    onUpdate: (previousValue: RepertoirePosition) => RepertoirePosition,
  ) => {
    const { store, tx } = await startTransaction();

    const fenWithHalfMoveClockReset = resetHalfMoveClock(fen);
    const position = await store.get(fenWithHalfMoveClockReset);

    await store.put(
      position ? onUpdate(position) : valueIfMissing,
      fenWithHalfMoveClockReset,
    );
    await tx.done;
  },
  entries: async () => {
    const { store, tx } = await startTransaction();
    const keys = await store.getAllKeys();
    const values = await store.getAll();
    await tx.done;

    return keys.map((key, i) => [key, values[i]]);
  },
  setEntries: async (entries: [string, RepertoirePosition][]) => {
    const { tx, store } = await startTransaction();
    await Promise.all(entries.map(([key, value]) => store.put(value, key)));
    await tx.done;
  },
  clear: async () => {
    const { db, tx } = await startTransaction();
    await db.clear(REPERTOIRE_STORE_KEYS.positions);
    await tx.done;
  },
};
