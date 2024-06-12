import { AnnotationSettings } from "@/components/reused/AnnotationSettings.tsx";

interface PgnImportSettingsProps {
  playerNames: string[];
  includeComments: boolean;
  onToggleIncludeComments: (includeComments: boolean) => void;
  onSelectPlayerName: (playerName: string | null) => void;
}

const NO_SELECTION = "No selection";

export const PgnImportSettings = ({
  onSelectPlayerName,
  playerNames,
  includeComments,
  onToggleIncludeComments,
}: PgnImportSettingsProps) => (
  <>
    <div className="divider" />
    <h4 className="font-bold text-sm mb-4">Import settings</h4>
    {playerNames.length > 0 && (
      <>
        <div className="label">
          <span className="label-text">
            Only set annotation for new moves done by player (optional):
          </span>
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => {
            const playerName = e.target.value;
            onSelectPlayerName(playerName === NO_SELECTION ? null : playerName);
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
      <div className="label-text flex items-center">
        <AnnotationSettings />
        <span className="ml-2">Annotation settings</span>
      </div>
    </div>
    <div className="form-control mt-4">
      <label className="label cursor-pointer w-max">
        <input
          type="checkbox"
          className="checkbox"
          checked={includeComments}
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
