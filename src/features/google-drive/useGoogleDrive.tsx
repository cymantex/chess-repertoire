import {
  openDefaultErrorToast,
  openErrorToast,
} from "@/external/react-toastify/toasts.ts";
import { useUploadRepertoire } from "@/features/google-drive/useUploadRepertoire.tsx";
import {
  hasExpired,
  useGoogleDriveLogin,
} from "@/features/google-drive/useGoogleDriveLogin.tsx";
import type { GoogleDriveLoginParams } from "@/features/google-drive/defs.ts";
import { useDownloadRepertoire } from "@/features/google-drive/useDownloadRepertoire.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { useGoogleCredential } from "@/features/google-drive/googleCredentialStore.ts";

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
        openDefaultErrorToast(error);
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
