import { importPgn } from "@/pgn/import/importPgn.ts";
import { ImportPgnOptions } from "@/pgn/import/defs.ts";

self.onmessage = async (
  event: MessageEvent<{
    pgn: string;
    options: ImportPgnOptions;
  }>,
) => {
  try {
    const { pgn, options } = event.data;

    const { reportProgressInterval, gameCount, totalGames } = await importPgn(
      pgn,
      options,
      (progress) => self.postMessage(progress),
    );

    clearInterval(reportProgressInterval);
    self.postMessage({ done: true, gameCount, totalGames });
  } catch (err) {
    console.error(err);
    self.reportError(err);
  }
};
