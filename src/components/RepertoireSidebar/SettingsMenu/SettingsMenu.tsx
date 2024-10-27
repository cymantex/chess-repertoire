import { RepertoireSettings } from "@/components/RepertoireSidebar/SettingsMenu/RepertoireSettings.tsx";
import { ThemeSettings } from "@/components/RepertoireSidebar/SettingsMenu/ThemeSettings.tsx";
import { EngineSettings } from "@/components/RepertoireSidebar/SettingsMenu/EngineSettings.tsx";
import { GoogleDriveSettings } from "@/components/RepertoireSidebar/SettingsMenu/GoogleDriveSettings.tsx";
import { useRepertoireSettings } from "@/stores/repertoireSettingsStore.ts";

export const SettingsMenu = () => {
  const { googleDriveEnabled } = useRepertoireSettings();

  return (
    <>
      <RepertoireSettings />
      <ThemeSettings />
      <EngineSettings />
      {googleDriveEnabled && <GoogleDriveSettings />}
    </>
  );
};
