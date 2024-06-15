// WARNING: The streamsaver dependency cannot be imported by a vitest file
import streamSaver from "streamsaver";
import { generateChessLines } from "@/pgn/export/generateChessLines.ts";
import { getRepertoirePosition } from "@/stores/repertoireRepository.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/pgn/utils.ts";
import { idpEntries, idpSetEntries } from "@/external/idb-keyval/adapter.ts";

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
      const pgn = await toPgn(chess);
      const uint8array = new TextEncoder().encode(pgn + "\n\n\n");
      await writer.write(uint8array);
    }

    await writer.close().catch(() => {});
  } catch (error) {
    console.error(error);
    await Promise.all([fileStream.abort(), writer.abort()]);
  }
};

export const exportDb = async () => {
  const fileStream = streamSaver.createWriteStream("repertoire.json");
  const writer = fileStream.getWriter();

  window.onbeforeunload = () => {
    fileStream.abort();
    writer.abort();
  };

  try {
    const entries = await idpEntries();
    const uint8array = new TextEncoder().encode(JSON.stringify(entries));
    await writer.write(uint8array);
    await writer.close().catch(() => {});
  } catch (error) {
    console.error(error);
    await Promise.all([fileStream.abort(), writer.abort()]);
  }
};

export const importDb = async (file: File) => {
  const reader = new FileReader();
  reader.readAsText(file);

  return new Promise<void>((resolve, reject) => {
    reader.onload = async (event) => {
      console.log("Importing");

      try {
        const entries = JSON.parse(event.target!.result as string);
        console.log(entries[0]);
        await idpSetEntries(entries);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
  });
};
