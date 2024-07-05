import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectSelectedDatabase } from "@/stores/zustand/selectors.ts";
import React from "react";
import { useClearRepertoire } from "@/components/RepertoireSidebar/SettingsMenu/hooks/useClearRepertoire.tsx";
import { modalStore } from "@/stores/modalStore.tsx";
import { DatabaseModal } from "@/components/reused/Modal/DatabaseModal/DatabaseModal.tsx";
import { MODAL_IDS } from "@/defs.ts";
import { PgnImport } from "@/components/RepertoireSidebar/SettingsMenu/PgnImport/PgnImport.tsx";
import { exportPgnAsync } from "@/pgn/export/exportPgnAsync.tsx";
import { exportRepertoire } from "@/components/RepertoireSidebar/SettingsMenu/actions.tsx";
import { SettingsMenuButton } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuButton.tsx";
import { SettingsMenuAlert } from "@/components/RepertoireSidebar/SettingsMenu/components/SettingsMenuAlert.tsx";
import { useRepertoireImport } from "@/components/RepertoireSidebar/SettingsMenu/hooks/useRepertoireImport.tsx";

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
