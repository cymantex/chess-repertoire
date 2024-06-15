import { ImportPgnOptions } from "@/defs.ts";
import { importPgn } from "@/pgn/import/importPgn.ts";

self.onmessage = async (
  event: MessageEvent<{
    pgn: string;
    options: ImportPgnOptions;
  }>,
) => {
  const { pgn, options } = event.data;

  const reportProgressInterval = await importPgn(pgn, options, (progress) =>
    self.postMessage(progress),
  );

  clearInterval(reportProgressInterval);
  self.postMessage({ done: true });
};
