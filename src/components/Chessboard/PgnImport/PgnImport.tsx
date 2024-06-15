import { useState } from "react";
import { PgnFileInput } from "@/components/Chessboard/PgnImport/components/PgnFileInput.tsx";
import { PgnImportSettings } from "@/components/Chessboard/PgnImport/components/PgnImportSettings.tsx";
import classNames from "classnames";
import { useRepertoireSettings } from "@/stores/localStorageStore.ts";
import { importPgnAsync } from "@/pgn/import/importPgnAsync.ts";
import {
  ANNOTATION_SETTINGS,
  AnnotationSetting,
  ImportPgnProgress,
} from "@/defs.ts";
import { isNumber } from "lodash";
import { useRepertoireStore } from "@/stores/zustand/useRepertoireStore.ts";
import { selectGetCurrentRepertoirePosition } from "@/stores/zustand/selectors.ts";

export const PgnImport = () => {
  const { annotationSetting } = useRepertoireSettings();

  const [modalOpen, setModalOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const getCurrentRepertoirePosition = useRepertoireStore(
    selectGetCurrentRepertoirePosition,
  );

  // ImportPgnSettings
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState<string | undefined>();
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [maxMoveNumber, setMaxMoveNumber] = useState<number | "">("");
  const [includeShapes, setIncludeShapes] = useState<boolean>(true);
  const [opponentAnnotationSetting, setOpponentAnnotationSetting] =
    useState<AnnotationSetting>(ANNOTATION_SETTINGS.NEUTRAL);
  const [playerAnnotationSetting, setPlayerAnnotationSetting] =
    useState(annotationSetting);

  const [importPgnProgress, setImportPgnProgress] = useState<
    ImportPgnProgress | undefined
  >();

  const importInProgress = importPgnProgress !== undefined;

  const handlePgnImport = async () => {
    setImportPgnProgress({});

    try {
      await importPgnAsync(
        file!,
        {
          annotationSetting: playerAnnotationSetting,
          includeComments,
          includeShapes,
          maxMoveNumber: isNumber(maxMoveNumber) ? maxMoveNumber : undefined,
          playerSettings: playerName
            ? { playerName, opponentAnnotationSetting }
            : undefined,
        },
        {
          onProgress: setImportPgnProgress,
        },
      );
    } catch (error) {
      // TODO: Properly handle error
      console.error(error);
      return;
    }

    await getCurrentRepertoirePosition();

    setModalOpen(false);
  };

  // TODO: Throw away component after hiding modal
  return (
    <div className="hidden md:block">
      <button onClick={() => setModalOpen(true)}>Import PGN</button>
      <dialog
        id="my_modal_3"
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
          <PgnFileInput
            disabled={importInProgress}
            onFileUpload={(file, playerNames) => {
              setFile(file);
              setPlayerNames(playerNames);
            }}
          />
          {file && (
            <PgnImportSettings
              disabled={importInProgress}
              selectedPlayerName={playerName}
              playerNames={playerNames}
              onSelectPlayerName={setPlayerName}
              includeComments={includeComments}
              onToggleIncludeComments={setIncludeComments}
              maxMoveNumber={maxMoveNumber}
              onMaxMoveNumberChange={setMaxMoveNumber}
              includeShapes={includeShapes}
              onToggleIncludeShapes={setIncludeShapes}
              playerAnnotationSetting={playerAnnotationSetting}
              onSelectPlayerAnnotationSetting={setPlayerAnnotationSetting}
              opponentAnnotationSetting={opponentAnnotationSetting}
              onSelectOpponentAnnotationSetting={setOpponentAnnotationSetting}
            />
          )}
          <div className="modal-action">
            <form method="dialog">
              <button
                disabled={!file || importInProgress}
                className="btn btn-loading"
                onClick={handlePgnImport}
              >
                {importInProgress ? (
                  <ImportProgress progress={importPgnProgress} />
                ) : (
                  <span>Upload</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

const ImportProgress = ({ progress }: { progress: ImportPgnProgress }) => {
  if (!isNumber(progress.gameCount) || !isNumber(progress.totalGames))
    return <span className="loading loading-spinner"></span>;

  return (
    <>
      <span className="loading loading-spinner"></span>
      Imported {progress.gameCount} of {progress.totalGames} game
      {progress.gameCount > 1 ? "s" : ""}
    </>
  );
};
