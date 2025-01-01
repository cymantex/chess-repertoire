import { useRepertoireStore } from "@/app/zustand/store.ts";
import React from "react";
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
      <SettingsMenuAlert title="Repertoire Database Operations">
        <div className="mt-2 text-xs">
          Selected database:{" "}
          <span className="font-bold">{selectedDatabase}</span>
        </div>
      </SettingsMenuAlert>
      <SettingsMenuButton
        onClick={() =>
          modalStore.setModal(<DatabaseModal id={MODAL_IDS.DATABASE} />)
        }
      >
        Manage Databases
      </SettingsMenuButton>
      <PgnImport />
      <SettingsMenuButton onClick={exportPgnAsync}>
        Export PGN
      </SettingsMenuButton>
      <SettingsMenuButton onClick={() => fileInput.current?.click()}>
        Import Repertoire
      </SettingsMenuButton>
      <input
        type="file"
        className="hidden"
        tabIndex={-1}
        ref={fileInput}
        onChange={handleRepertoireImport}
      />
      <SettingsMenuButton onClick={exportRepertoire}>
        Export Repertoire
      </SettingsMenuButton>
      <SettingsMenuButton onClick={confirmClearRepertoire}>
        Clear Repertoire
      </SettingsMenuButton>
    </>
  );
};
