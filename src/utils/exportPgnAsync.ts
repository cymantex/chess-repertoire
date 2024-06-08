import streamSaver from "streamsaver";
import { generateChessLines } from "@/utils/generateChessLines.ts";
import { getPositionData } from "@/store/database/repertoireDatabaseStore.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/external/chessjs/utils.ts";

export const exportPgnAsync = async () => {
  const fileStream = streamSaver.createWriteStream("repertoire.pgn");
  const writer = fileStream.getWriter();

  window.onbeforeunload = () => {
    fileStream.abort();
    writer.abort();
  };

  try {
    for (const chess of generateChessLines({
      getRepertoirePositionData: getPositionData,
      position: getPositionData(FEN_STARTING_POSITION),
      previousMoves: [],
    })) {
      const uint8array = new TextEncoder().encode(toPgn(chess) + "\n\n");
      await writer.write(uint8array);
    }

    await writer.close().catch(() => {});
  } catch (error) {
    console.error(error);
    await writer.abort();
  } finally {
    window.onbeforeunload = null;
  }
};
