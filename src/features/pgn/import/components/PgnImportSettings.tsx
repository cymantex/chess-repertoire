import { AnnotationSettings } from "@/features/annotations/AnnotationSettings.tsx";
import { isNotEmptyArray } from "@/common/utils/utils.ts";

import type { AnnotationSetting } from "@/features/annotations/defs.ts";

interface Props {
  disabled?: boolean;
  selectedPlayerName?: string;
  playerNames: string[];
  replaceAnnotations: boolean;
  onToggleReplaceAnnotations: (replaceAnnotations: boolean) => void;
  includeComments: boolean;
  onToggleIncludeComments: (includeComments: boolean) => void;
  maxMoveNumber: number | "";
  onMaxMoveNumberChange: (maxMoveNumber: number) => void;
  onSelectPlayerName: (playerName?: string) => void;
  opponentAnnotationSetting: AnnotationSetting;
  onSelectOpponentAnnotationSetting: (
    annotationSetting: AnnotationSetting,
  ) => void;
  playerAnnotationSetting: AnnotationSetting;
  onSelectPlayerAnnotationSetting: (
    annotationSetting: AnnotationSetting,
  ) => void;
}

const NO_SELECTION = "No selection";

export const PgnImportSettings = ({
  disabled,
  selectedPlayerName,
  onSelectPlayerName,
  playerNames,
  maxMoveNumber,
  onMaxMoveNumberChange,
  replaceAnnotations,
  onToggleReplaceAnnotations,
  includeComments,
  onToggleIncludeComments,
  opponentAnnotationSetting,
  onSelectOpponentAnnotationSetting,
  playerAnnotationSetting,
  onSelectPlayerAnnotationSetting,
}: Props) => (
  <>
    <div className="divider" />
    <h4 className="font-bold text-sm mb-4">Import settings</h4>
    {isNotEmptyArray(playerNames) && (
      <>
        <div className="label">
          <span className="label-text">
            Prefer to set annotations for player (optional):
          </span>
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          disabled={disabled}
          onChange={(e) => {
            const playerName = e.target.value;
            onSelectPlayerName(
              playerName === NO_SELECTION ? undefined : playerName,
            );
          }}
        >
          <option>{NO_SELECTION}</option>
          {playerNames.map((playerName) => (
            <option key={playerName}>{playerName}</option>
          ))}
        </select>
      </>
    )}
    <div className="label mt-4">
      <div className="label-text flex items-center text-2xl">
        <AnnotationSettings
          disabled={disabled}
          annotationSetting={playerAnnotationSetting}
          onSelect={onSelectPlayerAnnotationSetting}
        />
        {selectedPlayerName ? (
          <span className="ml-2 text-sm">
            Player annotation for moves from PGN
            <br />
            <span className="text-xs">(can replace existing annotations)</span>
          </span>
        ) : (
          <span className="ml-2 text-sm">Annotation for moves from PGN</span>
        )}
      </div>
    </div>
    {selectedPlayerName && (
      <div className="label mt-4">
        <div className="label-text flex items-center text-2xl">
          <AnnotationSettings
            disabled={disabled}
            annotationSetting={opponentAnnotationSetting}
            onSelect={onSelectOpponentAnnotationSetting}
          />
          <span className="ml-2 text-sm">
            Opponent(s) annotation for moves from PGN
            <br />
            <span className="text-xs">
              (cannot replace existing annotations)
            </span>
          </span>
        </div>
      </div>
    )}
    <div className="form-control mt-4">
      <label className="label cursor-pointer w-max">
        <input
          type="checkbox"
          className="checkbox"
          checked={replaceAnnotations}
          disabled={disabled}
          onChange={(e) => onToggleReplaceAnnotations(e.target.checked)}
        />
        <span className="label-text ml-2">
          Replace existing annotations
          <br />
          <span className="text-xs">
            (annotations are otherwise only added for new moves)
          </span>
        </span>
      </label>
    </div>
    <div className="form-control mt-4">
      <label className="label cursor-pointer w-max">
        <input
          type="checkbox"
          className="checkbox"
          checked={includeComments}
          disabled={disabled}
          onChange={(e) => onToggleIncludeComments(e.target.checked)}
        />
        <span className="label-text ml-2">
          Include comments
          <br />
          <span className="text-xs">(replacing existing ones)</span>
        </span>
      </label>
    </div>
    <div className="form-control mt-4">
      <div className="label w-max">
        <input
          type="number"
          min="1"
          max="999"
          disabled={disabled}
          className="input input-bordered w-16"
          value={maxMoveNumber}
          onChange={(e) => onMaxMoveNumberChange(e.target.valueAsNumber)}
        />
        <span className="label-text ml-2">
          Max move number
          <br />
          <span className="text-xs">(leave empty to import entire games)</span>
        </span>
      </div>
    </div>
    <div className="divider" />
  </>
);
