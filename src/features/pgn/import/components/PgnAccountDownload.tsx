import { useEffect, useRef, useState } from "react";
import { LuDownload } from "react-icons/lu";
import { downloadPlayerGames } from "@/features/pgn/import/downloadPlayerGames.ts";
import type { GameDownloadSource } from "@/features/pgn/import/downloadPlayerGames.ts";
import type { GameDownloadProgress } from "@/features/pgn/import/defs.ts";

interface Props {
  source: GameDownloadSource;
  disabled?: boolean;
  onFileChange: (
    file: File | null,
    playerNames: string[],
    playerName?: string,
  ) => void;
}

export const PgnAccountDownload = ({
  source,
  disabled,
  onFileChange,
}: Props) => {
  const [username, setUsername] = useState("");
  const [since, setSince] = useState("");
  const [maxGames, setMaxGames] = useState("");
  const [progress, setProgress] = useState<GameDownloadProgress>();
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const downloading = progress !== undefined;

  useEffect(
    () => () => {
      controller.current?.abort();
      controller.current = null;
    },
    [],
  );

  const download = async () => {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setError("");
    setProgress({ message: "Starting download…" });
    onFileChange(null, []);
    try {
      const result = await downloadPlayerGames({
        source,
        username,
        since: since || undefined,
        maxGames: maxGames ? Number(maxGames) : undefined,
        signal: request.signal,
        onProgress: setProgress,
      });
      if (!request.signal.aborted) {
        onFileChange(result.file, result.playerNames, result.playerName);
      }
    } catch (error) {
      if (!request.signal.aborted) {
        setError(
          error instanceof TypeError
            ? "Could not reach the game service. Check your connection and try again."
            : error instanceof SyntaxError
              ? "The game service returned an unreadable response. Please try again."
              : error instanceof Error
                ? error.message
                : "Could not download games. Please try again.",
        );
      }
    } finally {
      if (controller.current === request) {
        controller.current = null;
        setProgress(undefined);
      }
    }
  };

  return (
    <form
      className="rounded-lg border border-base-300 bg-base-200/40 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void download();
      }}
      onChange={() => {
        setError("");
        onFileChange(null, []);
      }}
    >
      <p className="mb-3 text-sm text-base-content/70">
        Download public standard chess games. No sign-in needed.
      </p>
      <fieldset disabled={disabled || downloading} className="space-y-3">
        <label className="form-control">
          <span className="label-text mb-1">
            {source === "lichess" ? "Lichess" : "Chess.com"} username
          </span>
          <input
            className="input input-bordered w-full"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="form-control">
            <span className="label-text mb-1">Played since (UTC)</span>
            <input
              type="date"
              className="input input-bordered w-full min-w-0"
              value={since}
              onChange={(event) => setSince(event.target.value)}
            />
            <span className="mt-1 text-xs text-base-content/60">
              Includes this date. Empty = all dates.
            </span>
          </label>
          <label className="form-control">
            <span className="label-text mb-1">Game limit</span>
            <input
              type="number"
              min="1"
              step="1"
              placeholder="All games"
              className="input input-bordered w-full"
              value={maxGames}
              onChange={(event) => setMaxGames(event.target.value)}
            />
            <span className="mt-1 text-xs text-base-content/60">
              Most recent first. Empty = no limit.
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="btn btn-outline btn-sm"
          disabled={!username.trim()}
        >
          <LuDownload aria-hidden="true" /> Download games
        </button>
      </fieldset>
      {downloading && (
        <div className="mt-3 rounded-lg border border-base-300 bg-base-100 p-3">
          <div className="flex items-center gap-3">
            <span
              className="loading loading-spinner loading-sm text-primary"
              aria-hidden="true"
            />
            <div role="status" className="min-w-0 flex-1 text-sm">
              <p>{progress.message}</p>
              {progress.bytesReceived !== undefined && (
                <p className="mt-1 font-medium tabular-nums">
                  {(
                    progress.bytesReceived /
                    (progress.bytesReceived >= 1_000_000 ? 1_000_000 : 1_000)
                  ).toLocaleString(undefined, { maximumFractionDigits: 1 })}
                  {progress.bytesReceived >= 1_000_000 ? " MB" : " KB"} received
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm shrink-0"
              onClick={() => controller.current?.abort()}
            >
              Cancel
            </button>
          </div>
          <p className="mt-2 text-xs text-base-content/60">
            Large histories can take several minutes. Progress updates as data
            arrives.
          </p>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-error">
          {error}
        </p>
      )}
    </form>
  );
};
