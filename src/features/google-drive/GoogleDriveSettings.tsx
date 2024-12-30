import { useGoogleDrive } from "@/features/google-drive/useGoogleDrive.tsx";
import { SettingsMenuAlert } from "@/features/sidebar/settings/SettingsMenuAlert.tsx";
import { SettingsMenuButton } from "@/features/sidebar/settings/SettingsMenuButton.tsx";
import { googleLogout } from "@react-oauth/google";
import { googleCredentialStore } from "@/features/google-drive/googleCredentialStore.ts";
import { openSuccessToast } from "@/external/react-toastify/toasts.ts";

export const GoogleDriveSettings = () => {
  const {
    email,
    isLoginRequired,
    loginToGoogle,
    downloadRepertoireFromGoogleDrive,
    uploadRepertoireToGoogleDrive,
  } = useGoogleDrive();

  return (
    <>
      <SettingsMenuAlert
        title={
          <>
            <span>Google Drive</span>
          </>
        }
      >
        {!isLoginRequired() && (
          <p className="mt-2 text-xs">
            Logged in as <strong>{email}</strong>
          </p>
        )}
      </SettingsMenuAlert>
      <SettingsMenuButton title="Hotkey: l" onClick={loginToGoogle}>
        {isLoginRequired() ? "Login" : "Switch Account"}
      </SettingsMenuButton>
      <SettingsMenuButton
        disabled={isLoginRequired()}
        onClick={() => {
          googleLogout();
          googleCredentialStore.removeCredential();
          openSuccessToast("Successfully logged out from Google Drive.");
        }}
      >
        Logout
      </SettingsMenuButton>
      <SettingsMenuButton
        title="Hotkey: d"
        onClick={downloadRepertoireFromGoogleDrive}
      >
        Download Repertoire
      </SettingsMenuButton>
      <SettingsMenuButton
        title="Hotkey: u"
        onClick={uploadRepertoireToGoogleDrive}
      >
        Upload Repertoire
      </SettingsMenuButton>
    </>
  );
};
