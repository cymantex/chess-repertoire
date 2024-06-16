import { PgnImport } from "@/components/Chessboard/PgnImport/PgnImport.tsx";
import { exportPgnAsync } from "@/pgn/export/exportPgnAsync.ts";
import { useRepertoireSettings } from "@/stores/localStorageStore.ts";
import { DAISY_UI_THEMES } from "@/defs.ts";
import React from "react";
import { modalStore } from "@/stores/modalStore.tsx";
import {
  changeTheme,
  exportRepertoire,
} from "@/components/RepertoireSidebar/components/SettingsMenu/actions.tsx";
import { useRepertoireImport } from "@/components/RepertoireSidebar/components/SettingsMenu/hooks/useRepertoireImport.tsx";
import { useClearRepertoire } from "@/components/RepertoireSidebar/components/SettingsMenu/hooks/useClearRepertoire.tsx";

export const SettingsMenu = () => {
  const { theme } = useRepertoireSettings();

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
      >
        {DAISY_UI_THEMES.map((daisyUiTheme) => (
          <option
            key={daisyUiTheme}
            value={daisyUiTheme}
            selected={daisyUiTheme === theme}
          >
            {daisyUiTheme}
          </option>
        ))}
      </select>
    </>
  );
};
