import { PgnFileInput } from "@/features/pgn/import/components/PgnFileInput.tsx";
import { useState } from "react";
import type { PgnImportFile } from "@/features/pgn/import/defs.ts";
import classNames from "classnames";
import { PgnAccountDownload } from "./PgnAccountDownload.tsx";
import type { GameDownloadSource } from "@/features/pgn/import/downloadPlayerGames.ts";

interface Props {
  onFileSelected: (pgn: PgnImportFile) => void;
}

export const PgnImportForm = ({ onFileSelected }: Props) => {
  const [pgn, setPgn] = useState<PgnImportFile | null>(null);
  const [source, setSource] = useState<"file" | GameDownloadSource>("file");

  const handleFileChange = (
    file: File | null,
    names: string[],
    preferredPlayer?: string,
  ) => {
    const selected = file
      ? { file, playerNames: names, playerName: preferredPlayer }
      : null;
    setPgn(selected);
    if (selected) onFileSelected(selected);
  };

  return (
    <>
      <p className="mb-4 text-sm text-base-content/70">
        Choose a PGN file or download a player’s games, then review your import
        settings.
      </p>
      <div
        role="group"
        aria-label="Game source"
        className="mb-4 grid grid-cols-3 gap-2"
      >
        {(
          [
            ["file", "PGN file"],
            ["lichess", "Lichess"],
            ["chesscom", "Chess.com"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={source === value}
            className={classNames(
              "btn btn-sm",
              source === value ? "btn-primary" : "btn-outline",
            )}
            onClick={() => {
              if (source === value) return;
              setSource(value);
              setPgn(null);
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {source === "file" ? (
        <PgnFileInput onFileUpload={handleFileChange} />
      ) : (
        <PgnAccountDownload
          key={source}
          source={source}
          onFileChange={handleFileChange}
        />
      )}
      {pgn && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 p-3">
          <span role="status" className="min-w-0 flex-1 break-all text-sm">
            Ready to import: {pgn.file.name}
          </span>
        </div>
      )}
      <div className="modal-action">
        <button
          type="button"
          disabled={!pgn}
          className="btn btn-primary"
          onClick={() => {
            if (pgn) onFileSelected(pgn);
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
};
