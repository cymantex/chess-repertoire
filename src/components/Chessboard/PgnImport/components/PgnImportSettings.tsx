import { AnnotationSettings } from "@/components/reused/AnnotationSettings.tsx";
import { isNotEmptyArray } from "@/utils/utils.ts";
import { AnnotationSetting } from "@/repertoire/defs.ts";

interface PgnImportSettingsProps {
  disabled?: boolean;
  selectedPlayerName?: string;
  playerNames: string[];
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
  includeComments,
  onToggleIncludeComments,
  opponentAnnotationSetting,
  onSelectOpponentAnnotationSetting,
  playerAnnotationSetting,
  onSelectPlayerAnnotationSetting,
}: PgnImportSettingsProps) => (
  <>
    <div className="divider" />
    <h4 className="font-bold text-sm mb-4">Import settings</h4>
    {isNotEmptyArray(playerNames) && (
      <>
        <div className="label">
          <span className="label-text">
            Set annotations for new moves done by player (optional):
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
          <span className="ml-2 text-sm">Player annotation settings</span>
        ) : (
          <span className="ml-2 text-sm">Annotation settings</span>
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
          <span className="ml-2 text-sm">Opponent(s) annotation settings</span>
        </div>
      </div>
    )}
    <div className="form-control mt-4">
      <div className="label">
        <span className="label-text">
          Max move number (leave empty to import entire games):
        </span>
      </div>
      <input
        type="number"
        min="1"
        max="999"
        disabled={disabled}
        className="input input-bordered w-16"
        value={maxMoveNumber}
        onChange={(e) => onMaxMoveNumberChange(e.target.valueAsNumber)}
      />
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
          Include comments (overwriting existing ones)
        </span>
      </label>
    </div>
    <div className="divider" />
  </>
);
