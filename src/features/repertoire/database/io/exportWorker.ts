import { positionsStore } from "@/features/repertoire/database/positionsStore.ts";

self.onmessage = async () => {
  try {
    const entries = await positionsStore.entries();
    self.postMessage(new TextEncoder().encode(JSON.stringify(entries)));
  } catch (err) {
    console.error(err);
    self.reportError(err);
  }
};
