import streamSaver from "streamsaver";
import RepertoireImportWorker from "@/repertoire/importRepertoireWorker.ts?worker";
import RepertoireExportWorker from "@/repertoire/exportRepertoireWorker.ts?worker";

export const exportRepertoireFile = async () => {
  const fileStream = streamSaver.createWriteStream("repertoire.json");
  const writer = fileStream.getWriter();

  try {
    const uint8array = await startExportRepertoireWorker();
    await writer.write(uint8array);
    await writer.close().catch(() => {});
  } catch (error) {
    console.error(error);
    await Promise.all([fileStream.abort(), writer.abort()]);
  }
};

export const startImportRepertoireWorker = (file: File) =>
  new Promise<void>((resolve, reject) => {
    const worker = new RepertoireImportWorker();
    worker.onmessage = () => resolve();
    worker.onerror = reject;
    worker.postMessage({ file });
  });

const startExportRepertoireWorker = () =>
  new Promise<Uint8Array>((resolve, reject) => {
    const worker = new RepertoireExportWorker();
    worker.onmessage = async (event) => resolve(event.data);
    worker.onerror = reject;
    worker.postMessage("start");
  });
