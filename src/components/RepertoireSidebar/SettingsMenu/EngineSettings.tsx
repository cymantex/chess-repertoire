import {
  repertoireSettingsStore,
  useRepertoireSettings,
} from "@/stores/repertoireSettingsStore.ts";
import { toSearchTimeDisplayName } from "@/utils/utils.ts";
import { SettingsMenuAlert } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuAlert.tsx";
import { Range } from "@/components/RepertoireSidebar/SettingsMenu/components/Range.tsx";

export const EngineSettings = () => {
  const { engineSettings } = useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;

  return (
    <>
      <SettingsMenuAlert title="Engine" />
      <div className="p-4 mt-2 mb-2 block">
        <Range
          min="1"
          max="10"
          step="1"
          name="Lines"
          className="mb-2"
          value={multiPv}
          label={`${multiPv} / 10`}
          onChange={(multiPv) =>
            repertoireSettingsStore.upsertEngineSettings({
              multiPv,
            })
          }
        />
        <Range
          min="1"
          max={navigator.hardwareConcurrency}
          step="1"
          name="Threads"
          className="mb-2"
          label={`${threads} / ${navigator.hardwareConcurrency}`}
          value={threads}
          onChange={(threads) =>
            repertoireSettingsStore.upsertEngineSettings({
              threads,
            })
          }
        />
        <Range
          min="4"
          max="32"
          step="2"
          name="Search Time"
          value={searchTimeSeconds === Infinity ? 32 : searchTimeSeconds}
          label={toSearchTimeDisplayName(searchTimeSeconds)}
          onChange={(searchTimeSeconds) =>
            repertoireSettingsStore.upsertEngineSettings({
              searchTimeSeconds:
                searchTimeSeconds === 32 ? Infinity : searchTimeSeconds,
            })
          }
        />
      </div>
    </>
  );
};
