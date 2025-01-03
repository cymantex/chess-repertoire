import { PgnFileInput } from "@/features/pgn/import/components/PgnFileInput.tsx";
import { PgnImportSettings } from "@/features/pgn/import/components/PgnImportSettings.tsx";
import { ImportProgress } from "@/features/pgn/import/components/ImportProgress.tsx";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import { useState } from "react";
import type {
  ImportPgnOptions,
  ImportPgnProgress,
} from "@/features/pgn/import/defs.ts";
import { isNumber } from "lodash";
import type {
  AnnotationSetting} from "@/features/annotations/defs.ts";
import {
  ANNOTATION_SETTINGS
} from "@/features/annotations/defs.ts";

interface Props {
  importPgnProgress?: Partial<ImportPgnProgress>;
  onUpload: (file: File, options: ImportPgnOptions) => void;
}

export const PgnImportForm = ({ importPgnProgress, onUpload }: Props) => {
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
      {!file && (
        <div role="alert" className="alert shadow-lg mb-5">
          <div>
            <div className="text-xs">
              Add moves from a PGN to your repertoire. Works well with PGN
              exports from lichess and chess.com.
              <br />
              <br />
              Download lichess games through:
              <br />
              <pre>https://lichess.org/api/games/user/{"{username}"}</pre>
              <br />
              Download chess.com games through:
              <br />
              <pre>https://www.chess.com/games/archive/{"{username}"}</pre>
            </div>
          </div>
        </div>
      )}
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
