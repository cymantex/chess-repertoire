import { useState } from "react";
import { importPgnFile } from "@/pgn/import/importPgnFile.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGetCurrentRepertoirePosition } from "@/stores/zustand/selectors.ts";
import { ImportPgnOptions, ImportPgnProgress } from "@/pgn/import/defs.ts";
import { PgnImportForm } from "@/components/RepertoireSidebar/SettingsMenu/PgnImport/PgnImportForm.tsx";
import { toast } from "react-toastify";
import { isNumber } from "lodash";
import { Modal } from "@/components/reused/Modal/Modal.tsx";

export const PgnImport = () => {
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
        toast.error(`Failed to import any games from ${file.name}`);
      } else {
        toast.success(`Imported ${gameCount} games from ${file.name}`);
      }
    } catch (error) {
      // @ts-ignore
      toast.error(error.message);
    } finally {
      window.onbeforeunload = null;
    }

    await getCurrentRepertoirePosition();

    setShowModal(false);
    setImportPgnProgress(undefined);
  };

  return (
    <div>
      <button className="btn w-full mb-2" onClick={() => setShowModal(true)}>
        Import PGN
      </button>
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
    </div>
  );
};
