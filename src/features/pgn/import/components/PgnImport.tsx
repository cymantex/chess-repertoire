import { useState } from "react";
import type { ReactNode } from "react";
import { importPgnFile } from "@/features/pgn/import/importPgnFile.ts";
import { useRepertoireStore } from "@/app/zustand/store.ts";
import type {
  ImportPgnOptions,
  ImportPgnProgress,
} from "@/features/pgn/import/defs.ts";
import { PgnImportForm } from "@/features/pgn/import/components/PgnImportForm.tsx";
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

  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  const [importPgnProgress, setImportPgnProgress] = useState<
    Partial<ImportPgnProgress> | undefined
  >();

  const importInProgress = importPgnProgress !== undefined;

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

    setShowModal(false);
    setImportPgnProgress(undefined);
  };

  return (
    <div>
      {renderTrigger(() => setShowModal(true))}
      {showModal && (
        <Modal show={showModal}>
          <Modal.CloseButton
            onClick={() => setShowModal(false)}
            disabled={importInProgress}
          />
          <Modal.Title>Import PGN</Modal.Title>
          <PgnImportForm
            key={showModal ? "open" : "closed"}
            onUpload={handlePgnImport}
            importPgnProgress={importPgnProgress}
          />
        </Modal>
      )}
    </div>
  );
};
