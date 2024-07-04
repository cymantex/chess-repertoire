import { useGoogleLogin } from "@react-oauth/google";
import {
  googleCredentialStore,
  useGoogleCredential,
} from "@/stores/googleCredentialStore.ts";
import { toast } from "react-toastify";
import { googleDriveApi } from "@/google/googleDriveApi.ts";
import { startExportRepertoireWorker } from "@/repertoire/repertoireIo.ts";
import {
  deregisterCoiServiceWorker,
  isCoiServiceWorkerRegistered,
} from "@/external/coi/coi.ts";
import { modalStore } from "@/stores/modalStore.tsx";
import { hasExpired } from "@/stores/utils.ts";
import { MODAL_IDS } from "@/defs.ts";

export const useGoogleDrive = (onLoginSuccess: () => void) => {
  const credential = useGoogleCredential();

  const login = useGoogleLogin({
    onSuccess: async (credential) => {
      googleCredentialStore.upsertCredential({
        ...credential,
        // Removing a minute since we don't know the exact time the token was
        // issued, it's better if it expires a bit earlier rather than an
        // expired token being used.
        issued_at: Date.now() - 60 * 1000,
      });
      onLoginSuccess();
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        `Google login failed (${error.error}: ${error.error_description})`,
      );
    },
    onNonOAuthError: (error) => {
      console.error(error);
      toast.error(
        // @ts-ignore
        `Google login failed (${error.type}: ${error.message})`,
      );
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  // TODO: Refactor this mess
  // TODO: Error handling
  // TODO: Configuration
  const handleUploadToGoogleDrive = async () => {
    const registered = await isCoiServiceWorkerRegistered();

    if (registered) {
      modalStore.addConfirmModal({
        children: (
          <>
            <p>
              Cannot upload to google drive as cross-origin isolation is
              currently enabled.
            </p>
            <p>A page refresh is required to disable it.</p>
            <p>Do you want to continue?</p>
          </>
        ),
        onConfirm: deregisterCoiServiceWorker,
      });
    }

    if (!credential || hasExpired(credential)) {
      modalStore.setLoadingModal("Logging in to Goggle...");
      login();
      return;
    }

    modalStore.setLoadingModal("Fetching files...");
    const files = await googleDriveApi.fetchFiles(credential.access_token);

    modalStore.setLoadingModal("Exporting repertoire...");
    const repertoireUint8Array = await startExportRepertoireWorker();
    const repertoireBlob = new Blob([repertoireUint8Array], {
      type: "application/octet-stream",
    });

    if (files.length === 0) {
      modalStore.setLoadingModal(
        "Creating repertoire.json file in your Google Drive...",
      );
      await googleDriveApi.createFile({
        fileName: "repertoire.json",
        mimeType: "application/json",
        repertoireBlob,
        accessToken: credential.access_token,
      });
      toast.success(`Created repertoire.json in your Google Drive.`);
    } else {
      const { id, name } = files[0];
      modalStore.setLoadingModal(
        `Updating ${name} file in your Google Drive...`,
      );
      console.log(`Updating file ${name} (${files[0].id})...`);
      // TODO: Let user choose what file to update
      await googleDriveApi.updateFile({
        fileId: id,
        repertoireBlob,
        accessToken: credential.access_token,
      });
      toast.success(`Updated ${name} in your Google Drive.`);
    }

    modalStore.closeModal(MODAL_IDS.LOADING);
  };

  // TODO: Download from Google Drive
  return {
    handleUploadToGoogleDrive,
  };
};
