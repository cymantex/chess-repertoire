import {
  ImportPgnCallbacks,
  ImportPgnGameOptions,
  ImportPgnOptions,
} from "@/defs.ts";
import ImportPgnWorker from "@/pgn/import/readPgnFileWorker.ts?worker";
import { chunk } from "lodash";
import { importGame } from "@/pgn/import/importGame.ts";
import { parsePgn } from "chessops/pgn";
import {
  setRepertoirePositionComment,
  setRepertoirePositionShapes,
  upsertRepertoireMove,
} from "@/stores/repertoireRepository.ts";

export const importPgnAsync = async (
  file: File,
  options: ImportPgnOptions,
  { onProgress }: ImportPgnCallbacks,
) => {
  const pgn = await readPgnFileAsync(file);
  const games = parsePgn(pgn);
  const gamesChunks = chunk(games, 300);
  const importGameOptions: ImportPgnGameOptions = {
    ...options,
    setComment: setRepertoirePositionComment,
    setShapes: setRepertoirePositionShapes,
    upsertMove: upsertRepertoireMove,
  };

  let gameCount = 0;

  const reportProgressInterval = setInterval(() => {
    onProgress({ totalGames: games.length, gameCount });
  }, 1000);

  for await (const games of gamesChunks) {
    await Promise.all(
      games.map((game) =>
        importGame(game, importGameOptions)
          .catch(console.error)
          .finally(() => gameCount++),
      ),
    );
  }

  clearInterval(reportProgressInterval);
};

const readPgnFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const worker = new ImportPgnWorker();
    worker.onmessage = (event) => resolve(event.data);
    worker.onerror = reject;
    worker.postMessage(file);
  });
};
