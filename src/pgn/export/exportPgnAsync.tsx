import { generateChessLines } from "@/pgn/export/generateChessLines.ts";
import { FEN_STARTING_POSITION } from "@/defs.ts";
import { toPgn } from "@/pgn/utils.ts";
import { getRepertoirePosition } from "@/repertoire/repertoireRepository.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { toast } from "react-toastify";
import { downloadUrl } from "@/utils/utils.ts";

export const exportPgnAsync = async () => {
  try {
    modalStore.showLoadingModal(
      <>
        Exporting PGN... <br />
        <span className="text-sm">(this could take hours...)</span>
      </>,
    );
    await exportPgn();
  } catch (error) {
    console.error(error);
    // @ts-ignore
    toast.error(`Failed to export repertoire ${error.message}`);
  } finally {
    modalStore.closeModal();
  }
};

async function exportPgn() {
  const chessLineGenerator = generateChessLines({
    getRepertoirePosition,
    position: await getRepertoirePosition(FEN_STARTING_POSITION),
    previousMoves: [],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chess of chessLineGenerator) {
        const pgn = toPgn(chess) + "\n\n\n";
        const uint8array = new TextEncoder().encode(pgn);
        controller.enqueue(uint8array);
      }
      controller.close();
    },
  });

  const response = new Response(readableStream, {
    headers: { "Content-Type": "text/plain" },
  });
  const blob = await response.blob();
  downloadUrl(URL.createObjectURL(blob), "repertoire.pgn");
}
