import { openErrorToast } from "@/external/react-toastify/toasts.ts";
import { useUploadRepertoireToGoogleDrive } from "@/google/useUploadRepertoireToGoogleDrive.tsx";
import {
  hasExpired,
  useGoogleDriveLogin,
} from "@/google/useGoogleDriveLogin.tsx";

export const useGoogleDrive = () => {
  const login = useGoogleDriveLogin();

  const uploadToGoogleDrive = useUploadRepertoireToGoogleDrive({
    isLoginRequired: (credential) => !credential || hasExpired(credential),
    login,
  });

  // TODO: Download from Google Drive
  // TODO: Logout from Google Drive
  return {
    handleUploadRepertoireToGoogleDrive: async () => {
      try {
        await uploadToGoogleDrive();
      } catch (error) {
        console.error(error);
        openErrorToast("Something went wrong when uploading to Google Drive.");
      }
    },
  };
};
