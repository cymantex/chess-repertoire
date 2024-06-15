import { ImportPgnProgress } from "@/pgn/import/defs.ts";
import { isNumber } from "lodash";

export const ImportProgress = ({
  progress,
}: {
  progress: Partial<ImportPgnProgress>;
}) => {
  if (!isNumber(progress.gameCount) || !isNumber(progress.totalGames))
    return <span className="loading loading-spinner"></span>;

  return (
    <>
      <span className="loading loading-spinner"></span>
      Imported {progress.gameCount} of {progress.totalGames} game
      {progress.gameCount > 1 ? "s" : ""}
    </>
  );
};
