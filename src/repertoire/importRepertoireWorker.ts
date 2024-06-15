import { idpSetEntries } from "@/external/idb-keyval/adapter.ts";

self.onmessage = async (event: MessageEvent<File>) => {
  const file = event.data;

  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const repertoireJson = event.target!.result as string;
      const entries = JSON.parse(repertoireJson);
      await idpSetEntries(entries);
      self.postMessage({ done: true });
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
