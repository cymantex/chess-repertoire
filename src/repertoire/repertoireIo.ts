import streamSaver from "streamsaver";
import RepertoireImportWorker from "@/repertoire/importRepertoireWorker.ts?worker";
import RepertoireExportWorker from "@/repertoire/exportRepertoireWorker.ts?worker";

export const exportRepertoireFile = async () => {
  const fileStream = streamSaver.createWriteStream("repertoire.json");
  const writer = fileStream.getWriter();

  // TODO: Deprecated, find better alternatives
  window.onunload = () => {
    fileStream.abort();
    writer.abort();
  };

  try {
    const uint8array = await startExportRepertoireWorker();
    await writer.write(uint8array);
    await writer.close().catch(() => {});
  } finally {
    window.onunload = null;
  }
};

export const startImportRepertoireWorker = (file: File) =>
  new Promise<void>((resolve, reject) => {
    const worker = new RepertoireImportWorker();
    worker.onmessage = () => resolve();
    worker.onerror = (err) => reject(err);
    worker.onmessageerror = (err) => reject(err);
    worker.postMessage(file);
  });

const startExportRepertoireWorker = () =>
  new Promise<Uint8Array>((resolve, reject) => {
    const worker = new RepertoireExportWorker();
    worker.onmessage = async (event) => resolve(event.data);
    worker.onerror = reject;
    worker.onmessageerror = reject;
    worker.postMessage("start");
  });
