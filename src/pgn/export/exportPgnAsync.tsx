import { modalStore } from "@/stores/modalStore.tsx";
import { toast } from "react-toastify";
import { downloadUrl, toRepertoireFileName } from "@/utils/utils.ts";
import ExportPgnWorker from "@/pgn/export/exportPgnWorker.ts?worker";
import { idbGetSelectedDbDisplayName } from "@/external/idb-keyval/adapter.ts";
import { LoadingModal } from "@/components/reused/Modal/LoadingModal.tsx";
import { MODAL_IDS } from "@/defs.ts";

export const exportPgnAsync = async () => {
  try {
    modalStore.showLoadingModal("Exporting PGN...");
    const blob = await startExportPgnWorker((exportedGames) =>
      modalStore.setModal(
        <LoadingModal id={MODAL_IDS.LOADING} show>
          <>
            Exporting PGN... <br />
            <span className="text-sm">(exported games: {exportedGames})</span>
          </>
        </LoadingModal>,
      ),
    );
    const repertoireDisplayName = await idbGetSelectedDbDisplayName();
    downloadUrl(
      URL.createObjectURL(blob),
      `${toRepertoireFileName(repertoireDisplayName)}.pgn`,
    );
  } catch (error) {
    console.trace();
    console.error(error);
    // @ts-ignore
    toast.error(`Failed to export repertoire ${error.message}`);
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
