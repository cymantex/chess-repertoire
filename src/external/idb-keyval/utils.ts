import { createStore } from "idb-keyval";

export const DEFAULT_DB_DISPLAY_NAME = "default";

const USER_REPERTOIRE_DB_NAME_PREFIX = "user-repertoire";

export const createOrGet = (dbName: string) =>
  createStore(dbName, toStoreName(dbName));

export const toStoreName = (dbName: string) => `${dbName}-store`;

export const isUserRepertoireDbName = (dbName: string) =>
  dbName.startsWith(USER_REPERTOIRE_DB_NAME_PREFIX);

export const toDisplayName = (dbName: string) =>
  dbName.replace(`${USER_REPERTOIRE_DB_NAME_PREFIX}-`, "");

export const toDbName = (dbDisplayName: string) => {
  if (dbDisplayName === DEFAULT_DB_DISPLAY_NAME) {
    return undefined;
  }

  return `${USER_REPERTOIRE_DB_NAME_PREFIX}-${dbDisplayName}`;
};

/**
 * The third last character in FEN is dedicated to the halfmove clock.
 * It's used to keep track of the 50 move rule and is not that relevant for an
 * application dedicated to openings. The halfmove causes positions that
 * would normally be considered transpositions in the opening to be seen as
 * different. Which means it causes more harm than good.
 */
export const resetHalfMoveClock = (fen: string) =>
  fen.slice(0, -3) + "0" + fen.slice(-2);
