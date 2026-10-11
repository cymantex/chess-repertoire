import { extractPlayerNames } from "@/features/pgn/utils.ts";
import { downloadLichessGames } from "./downloadLichessGames.ts";
import { downloadChessComGames } from "./downloadChessComGames.ts";
import type { GameDownloadProgress } from "./defs.ts";

export type GameDownloadSource = "lichess" | "chesscom";

interface DownloadOptions {
  source: GameDownloadSource;
  username: string;
  since?: string;
  maxGames?: number;
  signal: AbortSignal;
  onProgress: (progress: GameDownloadProgress) => void;
}

export const downloadPlayerGames = async ({
  source,
  username,
  since,
  maxGames,
  signal,
  onProgress,
}: DownloadOptions) => {
  username = username.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw new Error("Enter a username, rather than a profile URL.");
  }
  if (
    maxGames !== undefined &&
    (!Number.isSafeInteger(maxGames) || maxGames < 1)
  ) {
    throw new Error(
      "The game limit must be a positive whole number, or left empty.",
    );
  }

  const sinceTime = since ? Date.parse(`${since}T00:00:00Z`) : undefined;
  if (
    since &&
    (!Number.isFinite(sinceTime) ||
      new Date(sinceTime!).toISOString().slice(0, 10) !== since)
  ) {
    throw new Error("Choose a valid date.");
  }

  const site = source === "lichess" ? "Lichess" : "Chess.com";
  const download =
    source === "lichess" ? downloadLichessGames : downloadChessComGames;
  const pgn = await download({
    username,
    sinceTime,
    maxGames,
    signal,
    onProgress,
  });

  signal.throwIfAborted();
  const sample = (await pgn.slice(0, 65536).text()).trim();
  if (!sample) {
    throw new Error(
      `No standard chess games found for ${username} with these filters.`,
    );
  }
  const playerNames = extractPlayerNames(sample);
  if (!sample.startsWith("[") || playerNames.length === 0) {
    throw new Error(
      `${site} did not return a valid PGN. Please try again later.`,
    );
  }
  signal.throwIfAborted();
  return {
    file: new File([pgn], `${source}-${username}.pgn`, {
      type: "application/x-chess-pgn",
    }),
    playerNames,
    playerName: playerNames.find(
      (name) => name.toLowerCase() === username.toLowerCase(),
    ),
  };
};
