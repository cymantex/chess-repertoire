import { ChangeEvent } from "react";
import { modalStore } from "@/stores/modalStore.tsx";
import { startImportRepertoireWorker } from "@/repertoire/repertoireIo.ts";
import { toast } from "react-toastify";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGetCurrentRepertoirePosition } from "@/stores/zustand/selectors.ts";
import { MODAL_IDS } from "@/defs.ts";

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
      toast.success("Repertoire imported.");
    } catch (error) {
      console.error(error);
      // @ts-ignore
      toast.error(`Failed to import repertoire ${error.message}`);
    } finally {
      window.onbeforeunload = null;
    }

    await getCurrentRepertoirePosition();

    modalStore.closeModal(MODAL_IDS.LOADING);
  };
};
