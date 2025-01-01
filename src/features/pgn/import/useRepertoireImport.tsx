import type { ChangeEvent } from "react";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { startImportRepertoireWorker } from "@/features/repertoire/database/io/io.ts";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import {
  getErrorMessage,
  openErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { selectGetCurrentRepertoirePosition } from "@/features/repertoire/repertoireSlice.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const useRepertoireImport = () => {
  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  return async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (!file) return;

    window.onbeforeunload = (event) => event.preventDefault();

    modalStore.addLoadingModal(
      <>
        Importing repertoire... <br />
        <span className="text-sm">(this could take many minutes)</span>
      </>,
    );

    try {
      await startImportRepertoireWorker(file);
      openSuccessToast("Repertoire imported.");
    } catch (error) {
      openErrorToast(`Failed to import repertoire ${getErrorMessage(error)}`);
    } finally {
      window.onbeforeunload = null;
    }

    await getCurrentRepertoirePosition();

    modalStore.closeModal(MODAL_IDS.LOADING);
  };
};
