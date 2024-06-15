import { idpEntries } from "@/external/idb-keyval/adapter.ts";

self.onmessage = async () => {
  const entries = await idpEntries();
  self.postMessage(new TextEncoder().encode(JSON.stringify(entries)));
};
