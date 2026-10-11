import { useState } from "react";
import type { ReactNode } from "react";
import { importPgnFile } from "@/features/pgn/import/importPgnFile.ts";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import type {
  ImportPgnOptions,
  ImportPgnProgress,
  PgnImportFile,
} from "@/features/pgn/import/defs.ts";
import { PgnImportForm } from "@/features/pgn/import/components/PgnImportForm.tsx";
import { PgnImportSettingsModal } from "./PgnImportSettingsModal.tsx";
import { isNumber } from "lodash";
import { Modal } from "@/common/components/Modal/Modal.tsx";
import {
  openDefaultErrorToast,
  openErrorToast,
  openSuccessToast,
} from "@/external/react-toastify/toasts.ts";
import { selectGetCurrentRepertoirePosition } from "@/features/repertoire/repertoireSlice.ts";

export const PgnImport = ({
  renderTrigger,
}: {
  renderTrigger: (open: () => void) => ReactNode;
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPgn, setSelectedPgn] = useState<PgnImportFile | null>(null);

  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  const [importPgnProgress, setImportPgnProgress] = useState<
    Partial<ImportPgnProgress> | undefined
  >();

  const importInProgress = importPgnProgress !== undefined;

  const close = () => {
    setShowModal(false);
    setSelectedPgn(null);
  };

  const handlePgnImport = async (file: File, options: ImportPgnOptions) => {
    setImportPgnProgress({});

    window.onbeforeunload = (event) => {
      event.preventDefault();
    };

    try {
      const { gameCount } = await importPgnFile(file!, options, {
        onProgress: setImportPgnProgress,
      });

      if (!isNumber(gameCount)) {
        openErrorToast(`Failed to import any games from ${file.name}`);
      } else {
        openSuccessToast(`Imported ${gameCount} games from ${file.name}`);
      }
    } catch (error) {
      openDefaultErrorToast(error);
    } finally {
      window.onbeforeunload = null;
    }

    await getCurrentRepertoirePosition();

    close();
    setImportPgnProgress(undefined);
  };

  return (
    <div>
      {renderTrigger(() => setShowModal(true))}
      {showModal && (
        <>
          <Modal show={!selectedPgn} aria-label="Choose a PGN">
            <Modal.CloseButton
              onClick={close}
              disabled={importInProgress}
              aria-label="Close PGN import"
            />
            <Modal.Title>Import PGN</Modal.Title>
            <PgnImportForm onFileSelected={setSelectedPgn} />
          </Modal>
          {selectedPgn && (
            <PgnImportSettingsModal
              pgn={selectedPgn}
              onBack={() => setSelectedPgn(null)}
              onClose={close}
              onImport={handlePgnImport}
              importPgnProgress={importPgnProgress}
            />
          )}
        </>
      )}
    </div>
  );
};
