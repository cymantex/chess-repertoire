import { useState } from "react";
import { Modal } from "@/common/components/Modal/Modal.tsx";
import { downloadUrl } from "@/common/utils/utils.ts";
import { useRepertoireSettings } from "@/features/repertoire/settings/repertoireSettingsStore.ts";
import type { AnnotationSetting } from "@/features/annotations/defs.ts";
import { ANNOTATION_SETTINGS } from "@/features/annotations/defs.ts";
import type {
  ImportPgnOptions,
  ImportPgnProgress,
  PgnImportFile,
} from "@/features/pgn/import/defs.ts";
import { PgnImportSettings } from "./PgnImportSettings.tsx";
import { ImportProgress } from "./ImportProgress.tsx";

interface Props {
  pgn: PgnImportFile;
  importPgnProgress?: Partial<ImportPgnProgress>;
  onImport: (file: File, options: ImportPgnOptions) => void;
  onBack: () => void;
  onClose: () => void;
}

export const PgnImportSettingsModal = ({
  pgn,
  importPgnProgress,
  onImport,
  onBack,
  onClose,
}: Props) => {
  const { annotationSetting } = useRepertoireSettings();
  const [playerName, setPlayerName] = useState(pgn.playerName);
  const [includeComments, setIncludeComments] = useState(true);
  const [replaceAnnotations, setReplaceAnnotations] = useState(true);
  const [maxMoveNumber, setMaxMoveNumber] = useState<number | "">(20);
  const [opponentAnnotationSetting, setOpponentAnnotationSetting] =
    useState<AnnotationSetting>(ANNOTATION_SETTINGS.NEUTRAL);
  const [playerAnnotationSetting, setPlayerAnnotationSetting] =
    useState(annotationSetting);
  const importInProgress = importPgnProgress !== undefined;

  return (
    <Modal show aria-label="PGN import settings">
      <Modal.CloseButton
        onClick={onClose}
        disabled={importInProgress}
        aria-label="Close PGN import"
      />
      <Modal.Title>Import settings</Modal.Title>
      <div className="mb-4 flex items-center gap-2 rounded-lg bg-base-200 p-3">
        <span className="min-w-0 flex-1 break-all text-sm">
          {pgn.file.name}
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={importInProgress}
          onClick={() =>
            downloadUrl(URL.createObjectURL(pgn.file), pgn.file.name)
          }
        >
          Save PGN
        </button>
      </div>
      <PgnImportSettings
        disabled={importInProgress}
        selectedPlayerName={playerName}
        playerNames={pgn.playerNames}
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
      <div className="modal-action">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={importInProgress}
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={importInProgress}
          onClick={() =>
            onImport(pgn.file, {
              replaceAnnotations,
              annotationSetting: playerAnnotationSetting,
              includeComments,
              maxMoveNumber:
                typeof maxMoveNumber === "number" &&
                Number.isFinite(maxMoveNumber)
                  ? maxMoveNumber
                  : undefined,
              playerSettings: playerName
                ? { playerName, opponentAnnotationSetting }
                : undefined,
            })
          }
        >
          {importPgnProgress ? (
            <ImportProgress progress={importPgnProgress} />
          ) : (
            "Import"
          )}
        </button>
      </div>
    </Modal>
  );
};
