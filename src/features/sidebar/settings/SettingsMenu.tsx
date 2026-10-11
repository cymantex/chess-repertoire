import { RepertoireSettings } from "@/features/repertoire/settings/RepertoireSettings.tsx";
import { ThemeSettings } from "@/features/sidebar/settings/ThemeSettings.tsx";
import { EngineSettings } from "@/features/chess-engine/EngineSettings.tsx";
import { GoogleDriveSettings } from "@/features/google-drive/GoogleDriveSettings.tsx";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { LichessLogoutSettings } from "@/features/lichess-auth/LichessLogoutSettings.tsx";

export const SettingsMenu = () => {
  const { googleDriveEnabled } = useRepertoireSettings();

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-lg font-semibold">Settings</h2>
      <section>
        <ThemeSettings />
      </section>
      <section>
        <EngineSettings />
      </section>
      <section>
        <RepertoireSettings />
      </section>
      {googleDriveEnabled && (
        <section>
          <GoogleDriveSettings />
        </section>
      )}
      <section>
        <LichessLogoutSettings />
      </section>
    </div>
  );
};
