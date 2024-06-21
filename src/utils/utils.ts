import { isNumber } from "lodash";

export const isNotEmptyArray = <T>(array?: T[]): array is T[] =>
  Array.isArray(array) && array.length > 0;

export const toSearchTimeDisplayName = (searchTimeSeconds: number) =>
  searchTimeSeconds === Infinity ? "∞" : `${searchTimeSeconds}s`;

export const toCpDisplayName = (cp: number) =>
  cp < 0 ? `${(cp / 100).toFixed(2)}` : `+${(cp / 100).toFixed(2)}`;

export const toAnalysisResultEvaluation = (result?: {
  cp?: number;
  mate?: number;
}) => {
  if (!result) {
    console.log(result);
    return "--.--";
  }

  if (result.mate) {
    return `#${result.mate}`;
  }

  if (!isNumber(result.cp)) {
    console.log(result);
    return "--.--";
  }

  return isNumber(result.cp) ? toCpDisplayName(result.cp) : "--.--";
};
