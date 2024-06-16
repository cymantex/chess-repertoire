import { PgnFileInput } from "@/components/Chessboard/PgnImport/components/PgnFileInput.tsx";
import { PgnImportSettings } from "@/components/Chessboard/PgnImport/components/PgnImportSettings.tsx";
import { ImportProgress } from "@/components/Chessboard/PgnImport/components/ImportProgress.tsx";
import { useRepertoireSettings } from "@/stores/localStorageStore.ts";
import { useState } from "react";
import { ImportPgnOptions, ImportPgnProgress } from "@/pgn/import/defs.ts";
import { isNumber } from "lodash";
import { ANNOTATION_SETTINGS, AnnotationSetting } from "@/repertoire/defs.ts";

interface PgnImportFormProps {
  importPgnProgress?: Partial<ImportPgnProgress>;
  onUpload: (file: File, options: ImportPgnOptions) => void;
}

export const PgnImportForm = ({
  importPgnProgress,
  onUpload,
}: PgnImportFormProps) => {
  const { annotationSetting } = useRepertoireSettings();
  const [file, setFile] = useState<File | null>(null);

  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState<string | undefined>();
  const [includeComments, setIncludeComments] = useState<boolean>(true);
  const [replaceAnnotations, setReplaceAnnotations] = useState<boolean>(true);
  const [maxMoveNumber, setMaxMoveNumber] = useState<number | "">("");
  const [opponentAnnotationSetting, setOpponentAnnotationSetting] =
    useState<AnnotationSetting>(ANNOTATION_SETTINGS.NEUTRAL);
  const [playerAnnotationSetting, setPlayerAnnotationSetting] =
    useState(annotationSetting);

  const importInProgress = importPgnProgress !== undefined;

  return (
    <>
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
          replaceAnnotations={replaceAnnotations}
          onToggleReplaceAnnotations={setReplaceAnnotations}
          includeComments={includeComments}
          onToggleIncludeComments={setIncludeComments}
          maxMoveNumber={maxMoveNumber}
          onMaxMoveNumberChange={setMaxMoveNumber}
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
            onClick={() =>
              onUpload(file!, {
                replaceAnnotations,
                annotationSetting: playerAnnotationSetting,
                includeComments,
                maxMoveNumber: isNumber(maxMoveNumber)
                  ? maxMoveNumber
                  : undefined,
                playerSettings: playerName
                  ? { playerName, opponentAnnotationSetting }
                  : undefined,
              })
            }
          >
            {importInProgress ? (
              <ImportProgress progress={importPgnProgress} />
            ) : (
              <span>Upload</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
};
