import { modalStore } from "@/stores/modalStore.tsx";
import { exportRepertoireFile } from "@/repertoire/repertoireIo.ts";
import { toast } from "react-toastify";
import { ChangeEvent } from "react";
import { localStorageStore } from "@/stores/localStorageStore.ts";
import { Theme } from "@/repertoire/defs.ts";

export async function exportRepertoire() {
  modalStore.showLoadingModal(
    <>
      Exporting repertoire... <br />
      <span className="text-sm">(this could take many minutes)</span>
    </>,
  );

  window.onbeforeunload = (event) => event.preventDefault();

  try {
    await exportRepertoireFile();
  } catch (error) {
    console.error(error);
    // @ts-ignore
    toast.error(`Failed to export repertoire ${error.message}`);
  } finally {
    window.onbeforeunload = null;
  }

  modalStore.closeModal();
}

export const changeTheme = (event: ChangeEvent<HTMLSelectElement>) => {
  if (!event.target.value) return;

  document.documentElement.setAttribute("data-theme", event.target.value);

  localStorageStore.upsertSettings({
    theme: event.target.value as Theme,
  });
};
