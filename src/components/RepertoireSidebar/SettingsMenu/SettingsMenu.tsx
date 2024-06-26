import { PgnImport } from "@/components/RepertoireSidebar/SettingsMenu/PgnImport/PgnImport.tsx";
import { exportPgnAsync } from "@/pgn/export/exportPgnAsync.tsx";
import {
  localStorageStore,
  useRepertoireSettings,
} from "@/stores/localStorageStore.ts";
import { DAISY_UI_THEMES, MODAL_IDS } from "@/defs.ts";
import React, { InputHTMLAttributes, ReactNode } from "react";
import { modalStore } from "@/stores/modalStore.tsx";
import {
  changeBoardTheme,
  changePieceTheme,
  changeTheme,
  exportRepertoire,
} from "@/components/RepertoireSidebar/SettingsMenu/actions.tsx";
import { useRepertoireImport } from "@/components/RepertoireSidebar/SettingsMenu/hooks/useRepertoireImport.tsx";
import { useClearRepertoire } from "@/components/RepertoireSidebar/SettingsMenu/hooks/useClearRepertoire.tsx";
import { toSearchTimeDisplayName } from "@/utils/utils.ts";
import classNames from "classnames";
import {
  BOARD_THEMES,
  BoardTheme,
  PIECE_THEMES,
  PieceTheme,
} from "@/external/chessground/defs.tsx";
import { selectSelectedDatabase } from "@/stores/zustand/selectors.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { DatabaseModal } from "@/components/reused/Modal/DatabaseModal/DatabaseModal.tsx";

export const SettingsMenu = () => {
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);

  const { theme, boardTheme, pieceTheme, engineSettings } =
    useRepertoireSettings();
  const { multiPv, searchTimeSeconds, threads } = engineSettings;

  const fileInput = React.createRef<HTMLInputElement>();
  const handleRepertoireImport = useRepertoireImport();
  const handleClearRepertoire = useClearRepertoire();

  const confirmClearRepertoire = async () =>
    modalStore.addConfirmModal({
      onConfirm: handleClearRepertoire,
      children: "Are you sure you want to delete all data in your repertoire?",
    });

  return (
    <>
      <div role="alert" className="alert bg-base-300 mb-2 text-center block">
        <div>
          <h3 className="font-bold text-base mb-2">
            Repertoire database operations
          </h3>
          <div className="text-xs">
            Selected database:{" "}
            <span className="font-bold">{selectedDatabase}</span>
          </div>
        </div>
      </div>
      <button
        className="btn w-full mb-2"
        onClick={() =>
          modalStore.setModal(<DatabaseModal id={MODAL_IDS.DATABASE} />)
        }
      >
        Manage databases
      </button>
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
          <h3 className="font-bold text-base">Theming</h3>
        </div>
      </div>
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={changeTheme}
        value={theme}
      >
        <option disabled>Site theme</option>
        {DAISY_UI_THEMES.map((daisyUiTheme) => (
          <option key={daisyUiTheme} value={daisyUiTheme}>
            {daisyUiTheme}
          </option>
        ))}
      </select>
      <select
        className="select w-full mb-2 bg-base-200 text-center"
        onChange={(e) => changeBoardTheme(e.target.value as BoardTheme)}
        value={boardTheme}
      >
        <option disabled>Board theme</option>
        {Object.values(BOARD_THEMES).map((boardTheme) => (
          <option key={boardTheme} value={boardTheme}>
            {boardTheme}
          </option>
        ))}
      </select>
      <select
        className="select w-full bg-base-200 text-center"
        onChange={(e) => changePieceTheme(e.target.value as PieceTheme)}
        value={pieceTheme}
      >
        <option disabled>Piece theme</option>
        {Object.values(PIECE_THEMES).map((pieceTheme) => (
          <option key={pieceTheme} value={pieceTheme}>
            {pieceTheme}
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
            localStorageStore.upsertEngineSettings({
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
