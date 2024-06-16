// WARNING: The streamsaver dependency cannot be imported by a vitest file
import streamSaver from "streamsaver";
import { generateChessLines } from "@/pgn/export/generateChessLines.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/pgn/utils.ts";
import { getRepertoirePosition } from "@/repertoire/repertoireRepository.ts";

export const exportPgnAsync = async () => {
  // TODO: Consider generalizing something for streamsaver
  const fileStream = streamSaver.createWriteStream("repertoire.pgn");
  const writer = fileStream.getWriter();

  // TODO: Deprecated, find better alternatives
  window.onunload = () => {
    fileStream.abort();
    writer.abort();
  };

  try {
    const chessLineGenerator = generateChessLines({
      getRepertoirePosition,
      position: await getRepertoirePosition(FEN_STARTING_POSITION),
      previousMoves: [],
    });

    for await (const chess of chessLineGenerator) {
      const pgn = toPgn(chess) + "\n\n\n";
      const uint8array = new TextEncoder().encode(pgn);
      await writer.write(uint8array);
    }

    await writer.close().catch(() => {});
  } finally {
    window.onunload = null;
    fileStream.close();
    writer.close();
  }
};
