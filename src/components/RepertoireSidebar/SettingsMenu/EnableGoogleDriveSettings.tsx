import { SettingsMenuAlert } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuAlert.tsx";
import { SettingsMenuButton } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuButton.tsx";
import { repertoireSettingsStore } from "@/stores/repertoireSettingsStore.ts";

export const EnableGoogleDriveSettings = () => {
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
        <div className="text-xs mt-2">
          <p>Enable to allow syncing your repertoire with Google Drive.</p>
          <p className="font-bold mt-2">
            You have to request access as a tester to use this feature
          </p>
        </div>
      </SettingsMenuAlert>
      <SettingsMenuButton
        onClick={() =>
          repertoireSettingsStore.upsertSettings({
            googleDriveEnabled: true,
          })
        }
      >
        Enable
      </SettingsMenuButton>
    </>
  );
};
