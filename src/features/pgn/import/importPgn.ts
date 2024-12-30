import { parsePgn } from "chessops/pgn";
import { chunk } from "lodash";
import {
  setRepertoirePositionComments,
  upsertRepertoireMove,
} from "@/features/repertoire/repository.ts";
import { importGame } from "@/features/pgn/import/importGame.ts";
import type {
  ImportPgnGameOptions,
  ImportPgnOptions,
  ImportPgnProgress,
} from "@/features/pgn/import/defs.ts";

import { toRichTextEditorFormat } from "@/external/slate/utils.ts";

export async function importPgn(
  pgn: string,
  options: ImportPgnOptions,
  onProgress: (progress: ImportPgnProgress) => void,
) {
  const games = parsePgn(pgn);
  const gamesChunks = chunk(games, 150);
  const importGameOptions: ImportPgnGameOptions = {
    ...options,
    setComment: (fen: string, comment: string) =>
      setRepertoirePositionComments(fen, toRichTextEditorFormat(comment)),
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
