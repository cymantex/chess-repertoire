import { modalStore } from "@/stores/modalStore.tsx";
import { idbClear } from "@/external/idb-keyval/adapter.ts";
import { toast } from "react-toastify";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGetCurrentRepertoirePosition } from "@/stores/zustand/selectors.ts";
import { MODAL_IDS } from "@/defs.ts";

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
      toast.success("Repertoire cleared.");
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error(`Failed to clear repertoire ${error.message}`);
    }

    await getCurrentRepertoirePosition();
    modalStore.closeModal(MODAL_IDS.LOADING);
  };
};
