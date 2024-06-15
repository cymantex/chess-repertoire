import ImportPgnWorker from "@/pgn/import/importPgnWorker.ts?worker";
import ReadPgnWorker from "@/pgn/import/readPgnFileWorker.ts?worker";
import { importPgn } from "@/pgn/import/importPgn.ts";
import {
  ImportPgnCallbacks,
  ImportPgnOptions,
  ImportPgnProgress,
} from "@/pgn/import/defs.ts";

export const importPgnFile = async (
  file: File,
  options: ImportPgnOptions,
  { onProgress }: ImportPgnCallbacks,
): Promise<Partial<ImportPgnProgress>> => {
  const [pgnChunk1, pgnChunk2] = await startReadPgnFileWorker(file);

  if (pgnChunk1 === null) {
    return {};
  }

  let workerGameCount = 0;
  let workerTotalGames = 0;

  // noinspection ES6MissingAwait
  const importPgnPromise =
    pgnChunk2 !== null
      ? startImportPgnWorker(pgnChunk1, options, {
          onProgress: (progress) => {
            workerGameCount = progress.gameCount;
            workerTotalGames = progress.totalGames;
          },
        })
      : Promise.resolve();

  const { reportProgressInterval, gameCount, totalGames } = await importPgn(
    pgnChunk1,
    options,
    (progress) =>
      onProgress({
        gameCount: progress.gameCount + workerGameCount,
        totalGames: progress.totalGames + workerTotalGames,
      }),
  );

  await importPgnPromise;
  clearInterval(reportProgressInterval);

  return {
    gameCount: gameCount + workerGameCount,
    totalGames: totalGames + workerTotalGames,
  };
};

export const startImportPgnWorker = (
  pgn: string,
  options: ImportPgnOptions,
  { onProgress }: ImportPgnCallbacks,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const worker = new ImportPgnWorker();
    worker.onmessage = (event) => {
      onProgress(event.data);

      if (event.data.done) {
        resolve();
      }
    };
    worker.onerror = reject;
    worker.postMessage({ pgn, options });
  });

const startReadPgnFileWorker = (
  file: File,
): Promise<[string | null, string | null]> => {
  return new Promise((resolve, reject) => {
    const worker = new ReadPgnWorker();
    worker.onmessage = (event) => resolve(event.data);
    worker.onerror = reject;
    worker.postMessage(file);
  });
};
