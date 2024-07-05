import { modalStore } from "@/stores/modalStore.tsx";
import { downloadUrl, toRepertoireFileName } from "@/utils/utils.ts";
import ExportPgnWorker from "@/pgn/export/exportPgnWorker.ts?worker";
import { idbGetSelectedDbDisplayName } from "@/external/idb-keyval/adapter.ts";
import { MODAL_IDS } from "@/defs.ts";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";

export const exportPgnAsync = async () => {
  try {
    modalStore.addLoadingModal("Exporting PGN...");
    const blob = await startExportPgnWorker((exportedGames) =>
      modalStore.setLoadingModal(
        <>
          Exporting PGN... <br />
          <span className="text-sm">(exported games: {exportedGames})</span>
        </>,
      ),
    );
    const repertoireDisplayName = await idbGetSelectedDbDisplayName();
    downloadUrl(
      URL.createObjectURL(blob),
      `${toRepertoireFileName(repertoireDisplayName)}.pgn`,
    );
  } catch (error) {
    openDefaultErrorToast(error);
  } finally {
    modalStore.closeModal(MODAL_IDS.LOADING);
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
