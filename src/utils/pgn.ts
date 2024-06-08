import streamSaver from "streamsaver";
import { generateChessLines } from "@/utils/generateChessLines.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/external/chessjs/utils.ts";
import { getPositionData } from "@/store/idbActions.ts";

export const exportPgnAsync = async () => {
  const fileStream = streamSaver.createWriteStream("repertoire.pgn");
  const writer = fileStream.getWriter();

  window.onbeforeunload = () => {
    fileStream.abort();
    writer.abort();
  };

  try {
    const chessLineGenerator = generateChessLines({
      getRepertoirePositionData: getPositionData,
      position: await getPositionData(FEN_STARTING_POSITION),
      previousMoves: [],
    });

    for await (const chess of chessLineGenerator) {
      const uint8array = new TextEncoder().encode(toPgn(chess) + "\n\n");
      await writer.write(uint8array);
    }

    await writer.close().catch(() => {});
  } catch (error) {
    console.error(error);
    await Promise.all([fileStream.abort(), writer.abort()]);
  }
};

export const extractPlayerNames = (partialPgn: string) => {
  const playerNames = new Set<string>();

  const whitePlayer = partialPgn.match(/\[White "(.*)"]/);
  if (whitePlayer) {
    playerNames.add(whitePlayer[1]);
  }

  const blackPlayer = partialPgn.match(/\[Black "(.*)"]/);
  if (blackPlayer) {
    playerNames.add(blackPlayer[1]);
  }

  return Array.from(playerNames);
};
