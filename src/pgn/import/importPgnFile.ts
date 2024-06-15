import { ImportPgnCallbacks, ImportPgnOptions } from "@/defs.ts";
import ImportPgnWorker from "@/pgn/import/importPgnWorker.ts?worker";
import ReadPgnWorker from "@/pgn/import/readPgnFileWorker.ts?worker";
import { importPgn } from "@/pgn/import/importPgn.ts";

export const importPgnFile = async (
  file: File,
  options: ImportPgnOptions,
  { onProgress }: ImportPgnCallbacks,
): Promise<void> => {
  const [pgnChunk1, pgnChunk2] = await startReadPgnFileWorker(file);

  if (pgnChunk1 === null) {
    return;
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

  const reportProgressInterval = await importPgn(
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
};

export const startImportPgnWorker = (
  pgn: string,
  options: ImportPgnOptions,
  { onProgress }: ImportPgnCallbacks,
): Promise<void> =>
  new Promise((resolve, reject) => {
    const worker = new ImportPgnWorker();
    worker.onmessage = (event) => {
      if (event.data.done) {
        resolve();
      } else {
        onProgress(event.data);
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
