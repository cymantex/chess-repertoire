import { parsePgn } from "chessops/pgn";
import { chunk } from "lodash";
import {
  setRepertoirePositionComment,
  upsertRepertoireMove,
} from "@/repertoire/repertoireRepository.ts";
import { importGame } from "@/pgn/import/importGame.ts";
import {
  ImportPgnGameOptions,
  ImportPgnOptions,
  ImportPgnProgress,
} from "@/pgn/import/defs.ts";

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
    upsertMove: upsertRepertoireMove,
  };

  let gameCount = 0;
  const totalGames = games.length;

  const reportProgressInterval = setInterval(
    () =>
      onProgress({
        gameCount,
        totalGames,
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

  return { reportProgressInterval, gameCount, totalGames };
}
