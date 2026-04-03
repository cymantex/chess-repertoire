import { RepertoireSettings } from "@/features/repertoire/settings/RepertoireSettings.tsx";
import { ThemeSettings } from "@/features/sidebar/settings/ThemeSettings.tsx";
import { EngineSettings } from "@/features/chess-engine/EngineSettings.tsx";
import { GoogleDriveSettings } from "@/features/google-drive/GoogleDriveSettings.tsx";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { LichessLogoutSettings } from "@/features/lichess-auth/LichessLogoutSettings.tsx";

export const SettingsMenu = () => {
  const { googleDriveEnabled } = useRepertoireSettings();

  return (
    <>
      <RepertoireSettings />
      <ThemeSettings />
      <EngineSettings />
      {googleDriveEnabled && <GoogleDriveSettings />}
      <LichessLogoutSettings />
    </>
  );
};
