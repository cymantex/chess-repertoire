import { idpSetEntries } from "@/external/idb-keyval/adapter.ts";

self.onmessage = async (event: MessageEvent<File>) => {
  const file = event.data;

  const reader = new FileReader();

  reader.onload = async (event) => {
    const repertoireJson = event.target!.result as string;
    const entries = JSON.parse(repertoireJson);
    await idpSetEntries(entries);
    self.postMessage({ done: true });
  };

  reader.onerror = (err) => {
    throw err;
  };

  reader.readAsText(file);
};
