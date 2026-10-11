import { useRepertoireStore } from "@/app/zustand/store.ts";
import type { ButtonHTMLAttributes } from "react";
import React from "react";
import classNames from "classnames";
import {
  FaChevronRight,
  FaDatabase,
  FaDownload,
  FaFileExport,
  FaFileImport,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import { useClearRepertoire } from "@/features/repertoire/useClearRepertoire.tsx";
import { modalStore } from "@/common/components/Modal/modalStore.tsx";
import { DatabaseModal } from "@/features/repertoire/database/components/DatabaseModal.tsx";
import { PgnImport } from "@/features/pgn/import/components/PgnImport.tsx";
import { exportPgnAsync } from "@/features/pgn/export/exportPgnAsync.tsx";
import { exportRepertoire } from "@/features/sidebar/settings/actions.tsx";
import { SettingsMenuButton } from "@/features/sidebar/settings/SettingsMenuButton.tsx";
import { SettingsMenuAlert } from "@/features/sidebar/settings/SettingsMenuAlert.tsx";
import { useRepertoireImport } from "@/features/pgn/import/useRepertoireImport.tsx";
import { selectSelectedDatabase } from "@/features/repertoire/repertoireSlice.ts";
import { MODAL_IDS } from "@/common/components/Modal/defs.ts";

export const RepertoireSettings = () => {
  const selectedDatabase = useRepertoireStore(selectSelectedDatabase);
  const fileInput = React.createRef<HTMLInputElement>();
  const handleClearRepertoire = useClearRepertoire();
  const handleRepertoireImport = useRepertoireImport();

  const confirmClearRepertoire = async () =>
    modalStore.addConfirmModal({
      onConfirm: handleClearRepertoire,
      children: "Are you sure you want to delete all data in your repertoire?",
    });

  return (
    <>
      <SettingsMenuAlert title="Repertoire" />
      <div className="space-y-3">
        <OperationButton
          className="flex-nowrap justify-start text-left"
          onClick={() =>
            modalStore.setModal(<DatabaseModal id={MODAL_IDS.DATABASE} />)
          }
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-neutral">
            <FaDatabase aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block">Manage databases</span>
            <span
              title={selectedDatabase}
              className="mt-1 block truncate text-xs font-normal text-base-content/60"
            >
              Current: {selectedDatabase}
            </span>
          </span>
          <FaChevronRight
            aria-hidden="true"
            className="shrink-0 text-xs text-base-content/50"
          />
        </OperationButton>

        <div className="rounded-lg border border-base-300 bg-base-200/40 p-3">
          <h4 className="text-sm font-medium mb-3">PGN files</h4>
          <div className="grid grid-cols-2 gap-2">
            <PgnImport
              renderTrigger={(open) => (
                <OperationButton aria-label="Import PGN" onClick={open}>
                  <FaFileImport
                    aria-hidden="true"
                    className="shrink-0 text-neutral"
                  />
                  Import
                </OperationButton>
              )}
            />
            <OperationButton aria-label="Export PGN" onClick={exportPgnAsync}>
              <FaFileExport
                aria-hidden="true"
                className="shrink-0 text-neutral"
              />
              Export
            </OperationButton>
          </div>
        </div>

        <div className="rounded-lg border border-base-300 bg-base-200/40 p-3">
          <h4 className="text-sm font-medium mb-3">Repertoire files</h4>
          <div className="grid grid-cols-2 gap-2">
            <OperationButton
              aria-label="Import repertoire"
              onClick={() => fileInput.current?.click()}
            >
              <FaUpload aria-hidden="true" className="shrink-0 text-neutral" />
              Import
            </OperationButton>
            <OperationButton
              aria-label="Export repertoire"
              onClick={exportRepertoire}
            >
              <FaDownload
                aria-hidden="true"
                className="shrink-0 text-neutral"
              />
              Export
            </OperationButton>
          </div>
        </div>

        <div className="border-t border-base-300 pt-3">
          <OperationButton
            className="flex-nowrap justify-start !border-error/40 !bg-error/5 text-left hover:!bg-error/10"
            onClick={confirmClearRepertoire}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-error text-white">
              <FaTrash aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block">Clear repertoire</span>
              <span className="mt-1 block text-xs font-normal text-base-content/60">
                Remove all saved positions in this database
              </span>
            </span>
          </OperationButton>
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        tabIndex={-1}
        ref={fileInput}
        onChange={handleRepertoireImport}
      />
    </>
  );
};

const OperationButton = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <SettingsMenuButton
    type="button"
    {...props}
    className={classNames(
      "!mb-0 h-auto min-h-11 min-w-0 gap-2 rounded-lg border-base-300 bg-base-100 px-3 py-3 text-sm font-medium normal-case shadow-none hover:border-accent/50 hover:bg-base-200 focus-visible:outline-accent",
      className,
    )}
  />
);
