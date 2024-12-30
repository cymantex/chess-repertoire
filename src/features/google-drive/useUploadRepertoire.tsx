import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { useGoogleCredential } from "@/features/google-drive/googleCredentialStore.ts";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import { googleDriveApi } from "@/features/google-drive/googleDriveApi.ts";
import { openSuccessToast } from "@/external/react-toastify/toasts.ts";
import { exportRepertoireAsBlob } from "@/features/repertoire/database/io.ts";
import { GoogleDriveLoginParams } from "@/features/google-drive/defs.ts";
import { useCallback } from "react";
import { toRepertoireFileNameWithoutDate } from "@/common/utils/converters.ts";
import { selectSelectedDatabase } from "@/features/repertoire/repertoireSlice.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const useUploadRepertoire = ({
  isLoginRequired,
  login,
}: GoogleDriveLoginParams) => {
  const credential = useGoogleCredential();
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);

  const createFile = useCallback(
    async (repertoireFileName: string, repertoireBlob: Blob) => {
      modalStore.setLoadingModal(
        `Creating ${repertoireFileName} file in ${credential!.email} Google Drive...`,
      );
      await googleDriveApi.createFile({
        fileName: repertoireFileName,
        mimeType: "application/json",
        repertoireBlob,
        accessToken: credential!.access_token,
      });
      openSuccessToast(
        `Created ${repertoireFileName} in ${credential!.email} Google Drive.`,
      );
    },
    [credential],
  );

  const updateFile = useCallback(
    async (
      fileId: string,
      repertoireFileName: string,
      repertoireBlob: Blob,
    ) => {
      modalStore.setLoadingModal(
        `Updating ${repertoireFileName} file in ${credential!.email} Google Drive...`,
      );
      await googleDriveApi.updateFile({
        fileId,
        repertoireBlob,
        accessToken: credential!.access_token,
      });
      openSuccessToast(
        `Updated ${repertoireFileName} in ${credential!.email} Google Drive.`,
      );
    },
    [credential],
  );

  const determineUploadParams = useCallback(async () => {
    const repertoireFileName = `${toRepertoireFileNameWithoutDate(
      selectedDatabase!,
    )}.json`;
    modalStore.setLoadingModal(
      `Checking if ${repertoireFileName} exists in ${credential!.email} Google Drive...`,
    );
    const fileToUpdate = await googleDriveApi.fetchFileByName(
      credential!.access_token,
      repertoireFileName,
    );

    modalStore.setLoadingModal("Exporting repertoire...");
    const repertoireBlob = await exportRepertoireAsBlob();
    return { repertoireFileName, fileToUpdate, repertoireBlob };
  }, [credential, selectedDatabase]);

  return useCallback(async () => {
    if (isLoginRequired(credential)) {
      login();
      return;
    }

    const { repertoireFileName, fileToUpdate, repertoireBlob } =
      await determineUploadParams();

    if (!fileToUpdate) {
      await createFile(repertoireFileName, repertoireBlob);
    } else {
      await updateFile(fileToUpdate.id, repertoireFileName, repertoireBlob);
    }

    modalStore.closeModal(MODAL_IDS.LOADING);
  }, [
    createFile,
    updateFile,
    determineUploadParams,
    credential,
    isLoginRequired,
    login,
  ]);
};
