import { modalStore } from "@/stores/modalStore.tsx";
import {
  Credential,
  useGoogleCredential,
} from "@/stores/googleCredentialStore.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectSelectedDatabase } from "@/stores/zustand/selectors.ts";
import { googleDriveApi } from "@/google/googleDriveApi.ts";
import { openSuccessToast } from "@/external/react-toastify/toasts.ts";
import { toRepertoireFileNameWithoutDate } from "@/utils/utils.ts";
import { exportRepertoireAsBlob } from "@/repertoire/repertoireIo.ts";
import { MODAL_IDS } from "@/defs.ts";

export const useUploadRepertoireToGoogleDrive = ({
  isLoginRequired,
  login,
}: {
  isLoginRequired: (credential: Credential | null) => boolean;
  login: () => void;
}) => {
  const credential = useGoogleCredential();
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);

  const createFile = async (
    repertoireFileName: string,
    repertoireBlob: Blob,
  ) => {
    modalStore.setLoadingModal(
      `Creating ${repertoireFileName} file in your Google Drive...`,
    );
    await googleDriveApi.createFile({
      fileName: repertoireFileName,
      mimeType: "application/json",
      repertoireBlob,
      accessToken: credential!.access_token,
    });
    openSuccessToast(`Created ${repertoireFileName} in your Google Drive.`);
  };

  const uploadFile = async (
    fileId: string,
    repertoireFileName: string,
    repertoireBlob: Blob,
  ) => {
    modalStore.setLoadingModal(
      `Updating ${repertoireFileName} file in your Google Drive...`,
    );
    await googleDriveApi.updateFile({
      fileId,
      repertoireBlob,
      accessToken: credential!.access_token,
    });
    openSuccessToast(`Updated ${repertoireFileName} in your Google Drive.`);
  };

  const determineUploadParams = async () => {
    const repertoireFileName = `${toRepertoireFileNameWithoutDate(
      selectedDatabase!,
    )}.json`;
    modalStore.setLoadingModal(
      `Checking if ${repertoireFileName} exists in your Google Drive...`,
    );
    const fileToUpdate = await googleDriveApi.fetchFileByName(
      credential!.access_token,
      repertoireFileName,
    );

    modalStore.setLoadingModal("Exporting repertoire...");
    const repertoireBlob = await exportRepertoireAsBlob();
    return { repertoireFileName, fileToUpdate, repertoireBlob };
  };

  return async () => {
    if (isLoginRequired(credential)) {
      login();
      return;
    }

    const { repertoireFileName, fileToUpdate, repertoireBlob } =
      await determineUploadParams();

    if (!fileToUpdate) {
      await createFile(repertoireFileName, repertoireBlob);
    } else {
      await uploadFile(fileToUpdate.id, repertoireFileName, repertoireBlob);
    }

    modalStore.closeModal(MODAL_IDS.LOADING);
  };
};
