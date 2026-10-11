import type { GameDownloadOptions } from "./defs.ts";
import { requestGameDownload } from "./requestGameDownload.ts";

export const downloadLichessGames = async ({
  username,
  sinceTime,
  maxGames,
  signal,
  onProgress,
}: GameDownloadOptions): Promise<Blob> => {
  const params = new URLSearchParams({
    perfType: "ultraBullet,bullet,blitz,rapid,classical,correspondence",
    sort: "dateDesc",
  });
  if (sinceTime !== undefined) params.set("since", String(sinceTime));
  if (maxGames !== undefined) params.set("max", String(maxGames));
  const message = "Downloading games from Lichess…";
  onProgress({ message });
  const response = await requestGameDownload(
    `https://lichess.org/api/games/user/${encodeURIComponent(username)}?${params}`,
    {
      site: "Lichess",
      username,
      signal,
      accept: "application/x-chess-pgn",
      onProgress: (bytesReceived) => onProgress({ message, bytesReceived }),
    },
  );
  return response.blob();
};
