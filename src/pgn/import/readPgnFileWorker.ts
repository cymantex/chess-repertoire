import { chunk } from "lodash";

self.onmessage = async (event: MessageEvent<File>) => {
  const file = event.data;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const pgn = event.target!.result as string;
      const games = pgn.trim().split("\n\n\n");
      const chunks = chunk(games, games.length / 2);

      if (chunks.length === 0) {
        self.postMessage([null, null]);
      } else if (chunks.length === 1) {
        self.postMessage([chunks[0], null]);
      } else {
        self.postMessage([chunks[0].join("\n\n\n"), chunks[1].join("\n\n\n")]);
      }
    } catch (err) {
      console.error(err);
      self.reportError(err);
    }
  };
  reader.onerror = (err) => {
    throw err;
  };
  reader.readAsText(file);
};
