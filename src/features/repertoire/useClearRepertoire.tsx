import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import {
  openDefaultErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { selectGetCurrentRepertoirePosition } from "@/features/repertoire/repertoireSlice.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

import { positionsStore } from "@/features/repertoire/database/positionsStore.ts";

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
      await positionsStore.clear();
      openSuccessToast("Repertoire cleared.");
    } catch (error) {
      openDefaultErrorToast(error);
    }

    await getCurrentRepertoirePosition();
    modalStore.closeModal(MODAL_IDS.LOADING);
  };
};
