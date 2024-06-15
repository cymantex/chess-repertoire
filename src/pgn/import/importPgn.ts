import {
  ImportPgnGameOptions,
  ImportPgnOptions,
  ImportPgnProgress,
} from "@/defs.ts";
import { parsePgn } from "chessops/pgn";
import { chunk } from "lodash";
import {
  setRepertoirePositionComment,
  setRepertoirePositionShapes,
  upsertRepertoireMove,
} from "@/stores/repertoireRepository.ts";
import { importGame } from "@/pgn/import/importGame.ts";

export async function importPgn(
  pgn: string,
  options: ImportPgnOptions,
  onProgress: (progress: ImportPgnProgress) => void,
) {
  const games = parsePgn(pgn);
  const gamesChunks = chunk(games, 150);
  const importGameOptions: ImportPgnGameOptions = {
    ...options,
    setComment: setRepertoirePositionComment,
    setShapes: setRepertoirePositionShapes,
    upsertMove: upsertRepertoireMove,
  };

  let gameCount = 0;

  const reportProgressInterval = setInterval(
    () =>
      onProgress({
        gameCount,
        totalGames: games.length,
      }),
    1000,
  );

  for await (const games of gamesChunks) {
    await Promise.all(
      games.map((game) =>
        importGame(game, importGameOptions)
          .catch(console.error)
          .finally(() => gameCount++),
      ),
    );
  }

  return reportProgressInterval;
}
