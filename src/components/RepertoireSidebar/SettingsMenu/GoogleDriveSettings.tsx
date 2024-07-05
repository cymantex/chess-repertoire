import { useGoogleDrive } from "@/google/useGoogleDrive.tsx";
import { SettingsMenuAlert } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuAlert.tsx";
import { SettingsMenuButton } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuButton.tsx";
import { googleLogout } from "@react-oauth/google";
import { googleCredentialStore } from "@/stores/googleCredentialStore.ts";
import { openSuccessToast } from "@/external/react-toastify/toasts.ts";
import { useGoogleDriveShortcuts } from "@/google/useGoogleDriveShortcuts.ts";
import { repertoireSettingsStore } from "@/stores/repertoireSettingsStore.ts";

export const GoogleDriveSettings = () => {
  const {
    email,
    isLoginRequired,
    loginToGoogle,
    downloadRepertoireFromGoogleDrive,
    uploadRepertoireToGoogleDrive,
  } = useGoogleDrive();

  useGoogleDriveShortcuts();

  return (
    <>
      <SettingsMenuAlert
        title={
          <>
            <span>Google Drive</span>{" "}
            <span className="text-xs font-light align-top">(Beta)</span>
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
      <SettingsMenuButton
        onClick={() =>
          repertoireSettingsStore.upsertSettings({
            googleDriveEnabled: false,
          })
        }
      >
        Disable Feature
      </SettingsMenuButton>
    </>
  );
};
