import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { downloadUrl } from "@/common/utils/utils.ts";
import ExportPgnWorker from "@/features/pgn/export/exportPgnWorker.ts?worker";
import { openDefaultErrorToast } from "@/external/react-toastify/toasts.ts";
import { toRepertoireFileName } from "@/common/utils/converters.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";
import { settingsDb } from "@/features/repertoire/database/settingsDb.ts";

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
    const repertoireDisplayName =
      await settingsDb.getSelectedRepertoireDbDisplayName();
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
