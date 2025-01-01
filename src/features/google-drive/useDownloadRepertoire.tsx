import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { useGoogleCredential } from "@/features/google-drive/googleCredentialStore.ts";
import { googleDriveApi } from "@/features/google-drive/googleDriveApi.ts";
import {
  openInfoToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import type {
  GoogleDriveFile,
  GoogleDriveLoginParams,
} from "@/features/google-drive/defs.ts";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { useCallback } from "react";
import { toRepertoireFileNameWithoutDate } from "@/common/utils/converters.ts";
import {
  selectGetCurrentRepertoirePosition,
  selectSelectedDatabase,
} from "@/features/repertoire/repertoireSlice.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

import { positionsStore } from "@/features/repertoire/database/positionsStore.ts";

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
      await positionsStore.setEntries(repertoire);
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
