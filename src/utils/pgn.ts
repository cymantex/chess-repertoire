import streamSaver from "streamsaver";
import { generateChessLines } from "@/utils/generateChessLines.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/external/chessjs/utils.ts";
import { getRepertoirePosition } from "@/stores/repertoireRepository.ts";

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
