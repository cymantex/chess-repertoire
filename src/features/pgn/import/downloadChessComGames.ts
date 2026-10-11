import type { GameDownloadOptions } from "./defs.ts";
import { requestGameDownload } from "./requestGameDownload.ts";

export const downloadChessComGames = async ({
  username,
  sinceTime,
  maxGames,
  signal,
  onProgress,
}: GameDownloadOptions): Promise<Blob> => {
  const base = `https://api.chess.com/pub/player/${encodeURIComponent(username.toLowerCase())}/games/`;
  const requestOptions = {
    site: "Chess.com",
    username,
    signal,
    accept: "application/json",
  };
  onProgress({ message: "Finding Chess.com game archives…" });
  const response = await requestGameDownload(`${base}archives`, requestOptions);
  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("archives" in data) ||
    !Array.isArray(data.archives) ||
    !data.archives.every(
      (url: unknown): url is string =>
        typeof url === "string" &&
        url.toLowerCase().startsWith(base) &&
        /^\d{4}\/(0[1-9]|1[0-2])$/.test(url.slice(base.length)),
    )
  ) {
    throw new Error(
      "Chess.com returned an invalid archive list. Please try again later.",
    );
  }

  const firstMonth =
    sinceTime !== undefined
      ? new Date(sinceTime).toISOString().slice(0, 7).replace("-", "/")
      : undefined;
  const archives = data.archives
    .filter((url) => !firstMonth || url.slice(-7) >= firstMonth)
    .sort()
    .reverse();
  const parts: BlobPart[] = [];
  let gameCount = 0;
  let bytesReceived = 0;

  // Chess.com asks clients to fetch archives sequentially to avoid rate limits.
  for (const [index, archive] of archives.entries()) {
    signal.throwIfAborted();
    const message = `Month ${index + 1} of ${archives.length} (${archive.slice(-7)}) · Games found: ${gameCount}`;
    onProgress({ message, bytesReceived });
    let archiveBytes = 0;
    const response = await requestGameDownload(archive, {
      ...requestOptions,
      onProgress: (received) => {
        archiveBytes = received;
        onProgress({ message, bytesReceived: bytesReceived + received });
      },
    });
    const month: unknown = await response.json();
    bytesReceived += archiveBytes;
    if (
      !month ||
      typeof month !== "object" ||
      !("games" in month) ||
      !Array.isArray(month.games)
    ) {
      throw new Error(
        "Chess.com returned an invalid game archive. Please try again later.",
      );
    }
    // Monthly archives list games in ascending order of completion time.
    for (const game of month.games.reverse()) {
      if (
        !game ||
        typeof game.pgn !== "string" ||
        !game.pgn.trimStart().startsWith("[") ||
        typeof game.rules !== "string" ||
        !Number.isFinite(game.end_time)
      ) {
        throw new Error(
          "Chess.com returned an invalid game. Please try again later.",
        );
      }
      if (
        game.rules !== "chess" ||
        (sinceTime !== undefined && game.end_time * 1000 < sinceTime)
      )
        continue;
      parts.push(game.pgn.trim(), "\n\n");
      gameCount++;
      if (maxGames !== undefined && gameCount >= maxGames) break;
    }
    onProgress({
      message: `Months read: ${index + 1} of ${archives.length} · Games found: ${gameCount}`,
      bytesReceived,
    });
    if (maxGames !== undefined && gameCount >= maxGames) break;
  }
  return new Blob(parts, { type: "application/x-chess-pgn" });
};
