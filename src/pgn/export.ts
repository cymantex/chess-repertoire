// WARNING: The streamsaver dependency cannot be imported by a vitest file
import streamSaver from "streamsaver";
import { generateChessLines } from "@/pgn/generateChessLines.ts";
import { getRepertoirePosition } from "@/stores/repertoireRepository.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/pgn/utils.ts";

export const exportPgnAsync = async () => {
  const fileStream = streamSaver.createWriteStream("repertoire.pgn");
  const writer = fileStream.getWriter();

  window.onbeforeunload = () => {
    fileStream.abort();
    writer.abort();
  };

  try {
    const chessLineGenerator = generateChessLines({
      getRepertoirePosition: getRepertoirePosition,
      position: await getRepertoirePosition(FEN_STARTING_POSITION),
      previousMoves: [],
    });

    for await (const chess of chessLineGenerator) {
      const pgn = await toPgn(chess, getRepertoirePosition);
      const uint8array = new TextEncoder().encode(pgn + "\n\n");
      await writer.write(uint8array);
    }

    await writer.close().catch(() => {});
  } catch (error) {
    console.error(error);
    await Promise.all([fileStream.abort(), writer.abort()]);
  }
};
