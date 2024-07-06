import { modalStore } from "@/stores/modalStore.tsx";
import { useGoogleCredential } from "@/stores/googleCredentialStore.ts";
import { googleDriveApi } from "@/google/googleDriveApi.ts";
import { MODAL_IDS } from "@/defs.ts";
import {
  openInfoToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { GoogleDriveFile, GoogleDriveLoginParams } from "@/google/defs.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import {
  selectGetCurrentRepertoirePosition,
  selectSelectedDatabase,
} from "@/stores/zustand/selectors.ts";
import { idbSetEntries } from "@/external/idb-keyval/adapter.ts";
import { useCallback } from "react";
import { toRepertoireFileNameWithoutDate } from "@/utils/converters.ts";

export const useDownloadRepertoire = ({
  isLoginRequired,
  login,
}: GoogleDriveLoginParams) => {
  const credential = useGoogleCredential();
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  const downloadAndImportRepertoire = useCallback(
    async (repertoireFileName: string, file: GoogleDriveFile) => {
      modalStore.setLoadingModal(`Downloading ${repertoireFileName}...`);
      const repertoire = await googleDriveApi.downloadFile(
        file.id,
        credential!.access_token,
      );

      modalStore.setLoadingModal(`Importing ${repertoireFileName}...`);
      await idbSetEntries(repertoire);
      await getCurrentRepertoirePosition();
      openSuccessToast(`Imported ${repertoireFileName}.`);
      modalStore.closeModal(MODAL_IDS.LOADING);
    },
    [credential, getCurrentRepertoirePosition],
  );

  const showConfirmImportModal = useCallback(
    (repertoireFileName: string, file: GoogleDriveFile) =>
      modalStore.addConfirmModal({
        children: (
          <>
            <p>
              Found {repertoireFileName} in {credential!.email} Google Drive. Do
              you want to import it?
            </p>
            <p className="mt-2 text-sm font-light text-error">
              This will overwrite your currently selected repertoire (
              {selectedDatabase}).
            </p>
          </>
        ),
        onConfirm: () => downloadAndImportRepertoire(repertoireFileName, file),
      }),
    [downloadAndImportRepertoire, credential, selectedDatabase],
  );

  return useCallback(async () => {
    if (isLoginRequired(credential)) {
      login();
      return;
    }

    const repertoireFileName = `${toRepertoireFileNameWithoutDate(
      selectedDatabase!,
    )}.json`;
    modalStore.setLoadingModal(
      `Checking if ${repertoireFileName} exists in ${credential!.email} Google Drive...`,
    );
    const file = await googleDriveApi.fetchFileByName(
      credential!.access_token,
      repertoireFileName,
    );

    if (!file) {
      openInfoToast(
        `Could not find ${repertoireFileName} in ${credential!.email} Google Drive.`,
      );
      modalStore.closeModal(MODAL_IDS.LOADING);
    } else {
      modalStore.closeModal(MODAL_IDS.LOADING);
      showConfirmImportModal(repertoireFileName, file);
    }
  }, [
    showConfirmImportModal,
    credential,
    selectedDatabase,
    isLoginRequired,
    login,
  ]);
};
