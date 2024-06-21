import { PgnImport } from "@/components/Chessboard/PgnImport/PgnImport.tsx";
import { exportPgnAsync } from "@/pgn/export/exportPgnAsync.ts";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { DAISY_UI_THEMES } from "@/defs.ts";
import React, { InputHTMLAttributes, ReactNode } from "react";
import { modalStore } from "@/stores/modalStore.tsx";
import {
  changeTheme,
  exportRepertoire,
} from "@/components/RepertoireSidebar/components/SettingsMenu/actions.tsx";
import { useRepertoireImport } from "@/components/RepertoireSidebar/components/SettingsMenu/hooks/useRepertoireImport.tsx";
import { useClearRepertoire } from "@/components/RepertoireSidebar/components/SettingsMenu/hooks/useClearRepertoire.tsx";
import { toSearchTimeDisplayName } from "@/utils/utils.ts";
import classNames from "classnames";

export const SettingsMenu = () => {
  const { theme, engineSettings } = useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;

  const fileInput = React.createRef<HTMLInputElement>();
  const handleRepertoireImport = useRepertoireImport();
  const handleClearRepertoire = useClearRepertoire();

  const confirmClearRepertoire = async () =>
    modalStore.showConfirmModal({
      onConfirm: handleClearRepertoire,
      children: "Are you sure you want to delete all data in your repertoire?",
    });

  return (
    <>
      <div role="alert" className="alert bg-base-300 mb-2 text-center block">
        <div>
          <h3 className="font-bold text-base">Settings</h3>
          <div className="text-xs">
            Import, export or clear your repertoire.
          </div>
        </div>
      </div>
      <PgnImport />
      <button className="btn w-full mb-2" onClick={exportPgnAsync}>
        Export PGN
      </button>
      <button
        className="btn w-full mb-2"
        onClick={() => fileInput.current?.click()}
      >
        Import Repertoire
      </button>
      <button className="btn w-full mb-2" onClick={exportRepertoire}>
        Export Repertoire
      </button>
      <button className="btn w-full mb-2" onClick={confirmClearRepertoire}>
        Clear Repertoire
      </button>
      <input
        type="file"
        className="hidden"
        ref={fileInput}
        onChange={handleRepertoireImport}
      />
      <div role="alert" className="alert bg-base-300 mb-2 text-center block">
        <div>
          <h3 className="font-bold text-base">Theme</h3>
        </div>
      </div>
      <select
        className="select w-full bg-base-200 text-center"
        onChange={changeTheme}
        value={theme}
      >
        {DAISY_UI_THEMES.map((daisyUiTheme) => (
          <option key={daisyUiTheme} value={daisyUiTheme}>
            {daisyUiTheme}
          </option>
        ))}
      </select>
      <div
        role="alert"
        className="alert bg-base-300 mt-2 mb-2 text-center block"
      >
        <div>
          <h3 className="font-bold text-base">Engine</h3>
        </div>
      </div>
      <div className="p-4 border border-2 border-base-200 mt-2 mb-2 block">
        <Range
          min="1"
          max="10"
          step="1"
          name="Lines"
          className="mb-2"
          value={multiPv}
          label={`${multiPv} / 10`}
          onChange={(multiPv) =>
            localStorageStore.upsertEngineSettings({
              multiPv,
            })
          }
        />
        <Range
          min="1"
          max="32"
          step="1"
          name="Threads"
          className="mb-2"
          label={`${threads} / 32`}
          value={threads}
          onChange={(threads) =>
            localStorageStore.upsertEngineSettings({
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
            localStorageStore.upsertEngineSettings({
              searchTimeSeconds:
                searchTimeSeconds === 32 ? Infinity : searchTimeSeconds,
            })
          }
        />
      </div>
    </>
  );
};

interface RangeProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "name"> {
  name: ReactNode;
  label: ReactNode;
  onChange: (value: number) => unknown;
}

export const Range = ({
  name,
  label,
  onChange,
  className,
  ...props
}: RangeProps) => (
  <div className={classNames("flex text-sm font-thin items-center", className)}>
    <span className="w-28 mr-2">{name}</span>
    <input
      type="range"
      className="range range-primary"
      onChange={(e) => onChange(parseInt(e.target.value))}
      {...props}
    />
    <span className="w-16 whitespace-nowrap ml-2">{label}</span>
  </div>
);
