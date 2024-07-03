import { idbEntries } from "@/external/idb-keyval/adapter.ts";

self.onmessage = async (event: MessageEvent<string>) => {
  try {
    const entries = await idbEntries();
    if (event.data === "string") {
      self.postMessage(JSON.stringify(entries));
    } else {
      self.postMessage(new TextEncoder().encode(JSON.stringify(entries)));
    }
  } catch (err) {
    console.error(err);
    self.reportError(err);
  }
};
