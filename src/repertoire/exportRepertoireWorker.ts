import { idpEntries } from "@/external/idb-keyval/adapter.ts";

self.onmessage = async () => {
  try {
    const entries = await idpEntries();
    self.postMessage(new TextEncoder().encode(JSON.stringify(entries)));
  } catch (err) {
    console.error(err);
    self.reportError(err);
  }
};
