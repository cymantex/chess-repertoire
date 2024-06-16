import { clear, entries, get, setMany, update } from "idb-keyval";

export const idbUpsert = async <T>(
  fen: string,
  valueIfMissing: T,
  onUpdate: (previousValue: T) => T,
) =>
  update<T>(resetHalfMoveClock(fen), (previousValue) => {
    if (previousValue) {
      return onUpdate(previousValue);
    }

    return valueIfMissing;
  });

export const idbGet = async <T>(fen: string) => get<T>(resetHalfMoveClock(fen));

export const idbEntries = async <TValue>() => entries<string, TValue>();

export const idbSetEntries = async <TValue>(entries: [string, TValue][]) =>
  setMany(entries);

export const idbClear = async () => clear();

/**
 * The third last character in FEN is dedicated to the halfmove clock.
 * It's used to keep track of the 50 move rule and is not that relevant for an
 * application dedicated to openings. The halfmove causes positions that
 * would normally be considered transpositions in the opening to be seen as
 * different. Which means it causes more harm than good.
 */
const resetHalfMoveClock = (fen: string) =>
  fen.slice(0, -3) + "0" + fen.slice(-2);
