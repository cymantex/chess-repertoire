import { openErrorToast } from "@/external/react-toastify/toasts.ts";
import { useUploadRepertoire } from "@/google/useUploadRepertoire.tsx";
import {
  hasExpired,
  useGoogleDriveLogin,
} from "@/google/useGoogleDriveLogin.tsx";
import { GoogleDriveLoginParams } from "@/google/defs.ts";
import { useDownloadRepertoire } from "@/google/useDownloadRepertoire.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { useGoogleCredential } from "@/stores/googleCredentialStore.ts";

export const useGoogleDrive = () => {
  const credential = useGoogleCredential();
  const login = useGoogleDriveLogin();

  const googleDriveLoginParams: GoogleDriveLoginParams = {
    isLoginRequired: (credential) => !credential || hasExpired(credential),
    login,
  };
  const uploadRepertoire = useUploadRepertoire(googleDriveLoginParams);
  const downloadRepertoire = useDownloadRepertoire(googleDriveLoginParams);

  return {
    email: credential?.email,
    isLoginRequired: () => !credential || hasExpired(credential),
    loginToGoogle: login,
    downloadRepertoireFromGoogleDrive: async () => {
      try {
        await downloadRepertoire();
      } catch (error) {
        console.error(error);
        openErrorToast(
          "Something went wrong when downloading repertoire from Google Drive.",
        );
        modalStore.closeAllModals();
      }
    },
    uploadRepertoireToGoogleDrive: async () => {
      try {
        await uploadRepertoire();
      } catch (error) {
        console.error(error);
        openErrorToast(
          "Something went wrong when uploading repertoire to Google Drive.",
        );
        modalStore.closeAllModals();
      }
    },
  };
};
