import { useEffect } from "react";
import { useGoogleDrive } from "@/google/useGoogleDrive.tsx";
import { isAllowedGlobalShortcutTagType } from "@/utils/utils.ts";

export const useGoogleDriveShortcuts = () => {
  const {
    loginToGoogle,
    uploadRepertoireToGoogleDrive,
    downloadRepertoireFromGoogleDrive,
  } = useGoogleDrive();

  useEffect(() => {
    const handleGoogleDriveKeydown = (event: KeyboardEvent) => {
      if (!isAllowedGlobalShortcutTagType(event)) {
        return;
      }

      switch (event.key) {
        case "l":
          loginToGoogle();
          break;
        case "u":
          uploadRepertoireToGoogleDrive();
          break;
        case "d":
          downloadRepertoireFromGoogleDrive();
          break;
      }
    };

    window.addEventListener("keydown", handleGoogleDriveKeydown);

    return () => {
      window.removeEventListener("keydown", handleGoogleDriveKeydown);
    };
  }, [
    loginToGoogle,
    uploadRepertoireToGoogleDrive,
    downloadRepertoireFromGoogleDrive,
  ]);
};
