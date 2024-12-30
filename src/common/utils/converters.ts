import { isNumber } from "lodash";
import { getCurrentDate } from "@/common/utils/utils.ts";

export const toSearchTimeDisplayName = (searchTimeSeconds: number) =>
  searchTimeSeconds === Infinity ? "∞" : `${searchTimeSeconds}s`;

export const toCpDisplayName = (cp: number) =>
  cp < 0 ? `${(cp / 100).toFixed(2)}` : `+${(cp / 100).toFixed(2)}`;

export const toAnalysisResultEvaluation = (result?: {
  cp?: number;
  mate?: number;
}) => {
  if (!result) {
    return "--.--";
  }

  if (result.mate) {
    return `#${result.mate}`;
  }

  if (!isNumber(result.cp)) {
    return "--.--";
  }

  return isNumber(result.cp) ? toCpDisplayName(result.cp) : "--.--";
};

export const toRepertoireFileNameWithoutDate = (
  repertoireDisplayName: string,
) => `repertoire-${repertoireDisplayName.replace(/[^a-zA-Z0-9]/g, "")}`;

export const toRepertoireFileName = (repertoireDisplayName: string) =>
  `${toRepertoireFileNameWithoutDate(repertoireDisplayName)}-${getCurrentDate()}`;
