import { RepertoireSettings } from "@/components/RepertoireSidebar/SettingsMenu/RepertoireSettings.tsx";
import { ThemeSettings } from "@/components/RepertoireSidebar/SettingsMenu/ThemeSettings.tsx";
import { EngineSettings } from "@/components/RepertoireSidebar/SettingsMenu/EngineSettings.tsx";
import { GoogleDriveSettings } from "@/components/RepertoireSidebar/SettingsMenu/GoogleDriveSettings.tsx";

export const SettingsMenu = () => (
  <>
    <RepertoireSettings />
    <GoogleDriveSettings />
    <ThemeSettings />
    <EngineSettings />
  </>
);
