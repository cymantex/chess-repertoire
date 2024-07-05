import { modalStore } from "@/stores/modalStore.tsx";
import { idbClear } from "@/external/idb-keyval/adapter.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGetCurrentRepertoirePosition } from "@/stores/zustand/selectors.ts";
import { MODAL_IDS } from "@/defs.ts";
import {
  openDefaultErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";

export const useClearRepertoire = () => {
  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  return async () => {
    modalStore.addLoadingModal(
      <>
        Clearing repertoire... <br />
        <span className="text-sm">(this could take many minutes)</span>
      </>,
    );

    try {
      await idbClear();
      openSuccessToast("Repertoire cleared.");
    } catch (error) {
      openDefaultErrorToast(error);
    }

    await getCurrentRepertoirePosition();
    modalStore.closeModal(MODAL_IDS.LOADING);
  };
};
