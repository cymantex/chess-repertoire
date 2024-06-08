import { PrioritySettings } from "@/components/RepertoireSidebar/components/NavigationMenu/components/PrioritySettings.tsx";

interface PgnImportSettingsProps {
  playerNames: string[];
  onSelectPlayerName: (playerName: string | null) => void;
}

const NO_SELECTION = "No selection";

export const PgnImportSettings = ({
  onSelectPlayerName,
  playerNames,
}: PgnImportSettingsProps) => (
  <>
    <div className="divider" />
    <h4 className="font-bold text-sm mb-4">Import settings</h4>
    {playerNames.length > 0 && (
      <>
        <div className="label">
          <span className="label-text">
            Player to import the repertoire for (optional):
          </span>
        </div>
        <select
          className="select select-bordered w-full max-w-xs"
          onChange={(e) => {
            const playerName = e.target.value;
            onSelectPlayerName(playerName === NO_SELECTION ? null : playerName);
          }}
        >
          {playerNames.map((playerName) => (
            <option key={playerName}>{playerName}</option>
          ))}
          <option>{NO_SELECTION}</option>
        </select>
      </>
    )}
    <div className="label mt-4">
      <div className="label-text flex items-center">
        <span className="mr-2">Priority settings:</span>
        <PrioritySettings />
      </div>
    </div>
    <div className="divider" />
  </>
);
