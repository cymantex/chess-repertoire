import { modalStore } from "@/stores/modalStore.tsx";
import { toast } from "react-toastify";
import { downloadUrl } from "@/utils/utils.ts";
import ExportPgnWorker from "@/pgn/export/exportPgnWorker.ts?worker";

export const exportPgnAsync = async () => {
  try {
    modalStore.showLoadingModal("Exporting PGN...");
    const blob = await startExportPgnWorker((exportedGames) =>
      modalStore.showLoadingModal(
        <>
          Exporting PGN... <br />
          <span className="text-sm">(exported games: {exportedGames})</span>
        </>,
      ),
    );
    downloadUrl(URL.createObjectURL(blob), "repertoire.pgn");
  } catch (error) {
    console.trace();
    console.error(error);
    // @ts-ignore
    toast.error(`Failed to export repertoire ${error.message}`);
  } finally {
    modalStore.closeModal();
  }
};

const startExportPgnWorker = (
  onProgress: (exportedGames: number) => void,
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const worker = new ExportPgnWorker();
    worker.onmessage = (event) => {
      if (event.data.exportedGames) {
        onProgress(event.data.exportedGames);
      }
      if (event.data.blob) {
        resolve(event.data.blob);
      }
    };
    worker.onerror = reject;
    worker.onmessageerror = reject;
    worker.postMessage("start");
  });
};
