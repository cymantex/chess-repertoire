import { idbEntries } from "@/external/idb-keyval/adapter.ts";
import { RepertoirePosition } from "@/features/repertoire/defs.ts";
import { Chess } from "chess.js";
import { generateChessLines } from "@/features/pgn/export/generateChessLines.ts";
import { toPgn } from "@/features/pgn/utils.ts";
import { resetHalfMoveClock } from "@/external/idb-keyval/utils.ts";

import { FEN_STARTING_POSITION } from "@/external/chessops/defs.ts";

self.onmessage = async () => {
  try {
    const readableStream = new ReadableStream({
      async start(controller) {
        let exportedGames = 0;

        await exportRepertoireAsPgn((pgn) => {
          controller.enqueue(new TextEncoder().encode(pgn));

          exportedGames++;
          self.postMessage({ exportedGames });
        });

        controller.close();
      },
    });
    const response = new Response(readableStream, {
      headers: { "Content-Type": "text/plain" },
    });
    const blob = await response.blob();
    self.postMessage({ blob });
  } catch (err) {
    console.error(err);
    self.reportError(err);
  }
};

async function exportRepertoireAsPgn(onPgnGenerated: (pgn: string) => unknown) {
  const entries = await idbEntries<RepertoirePosition>();
  const repertoire = Object.fromEntries(entries);
  const startingPosition = repertoire[FEN_STARTING_POSITION];
  const moves = startingPosition?.moves ?? [];

  const promises = moves.map(async (move) => {
    const chess = new Chess();
    chess.move(move.san);

    const chessLineGenerator = generateChessLines({
      getRepertoirePosition: async (fen) => repertoire[resetHalfMoveClock(fen)],
      position: repertoire[resetHalfMoveClock(chess.fen())],
      previousMoves: chess.history(),
    });

    for await (const chess of chessLineGenerator) {
      onPgnGenerated(toPgn(chess) + "\n\n\n");
    }
  });

  return Promise.all(promises);
}
