import { useState } from "react";
import classNames from "classnames";
import { importPgnFile } from "@/pgn/import/importPgnFile.ts";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGetCurrentRepertoirePosition } from "@/stores/zustand/selectors.ts";
import { ImportPgnOptions, ImportPgnProgress } from "@/pgn/import/defs.ts";
import { PgnImportForm } from "@/components/Chessboard/PgnImport/components/PgnImportForm.tsx";
import { toast } from "react-toastify";
import { isNumber } from "lodash";

export const PgnImport = () => {
  const [modalOpen, setModalOpen] = useState(false);

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

    setModalOpen(false);
    setImportPgnProgress(undefined);
  };

  return (
    <div>
      <button className="btn w-full mb-2" onClick={() => setModalOpen(true)}>
        Import PGN
      </button>
      <dialog
        className={classNames("modal", {
          "modal-open": modalOpen,
        })}
      >
        <div className="modal-box overflow-visible">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            disabled={importInProgress}
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>
          <h3 className="font-bold text-lg mb-5">Import PGN</h3>
          <div role="alert" className="alert shadow-lg mb-5">
            <div>
              <div className="text-xs">
                New moves from the PGN will be added to your repertoire.
              </div>
            </div>
          </div>
          <hr className="border-base-200" />
          <PgnImportForm
            key={modalOpen ? "open" : "closed"}
            onUpload={handlePgnImport}
            importPgnProgress={importPgnProgress}
          />
        </div>
      </dialog>
    </div>
  );
};
