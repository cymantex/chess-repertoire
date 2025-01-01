import RepertoireImportWorker from "@/features/repertoire/database/io/importWorker.ts?worker";
import RepertoireExportWorker from "@/features/repertoire/database/io/exportWorker.ts?worker";
import { downloadUInt8Array } from "@/common/utils/utils.ts";
import { toRepertoireFileName } from "@/common/utils/converters.ts";
import { settingsDb } from "@/features/repertoire/database/settingsDb.ts";

export const exportRepertoireFile = async () => {
  const uint8array = await startExportRepertoireWorker();
  const repertoireDisplayName =
    await settingsDb.getSelectedRepertoireDbDisplayName();
  downloadUInt8Array(
    uint8array,
    `${toRepertoireFileName(repertoireDisplayName)}.json`,
  );
};

export const exportRepertoireAsBlob = async () => {
  const repertoireUint8Array = await startExportRepertoireWorker();

  return new Blob([repertoireUint8Array], {
    type: "application/octet-stream",
  });
};

export const startImportRepertoireWorker = (file: File) =>
  new Promise<void>((resolve, reject) => {
    const worker = new RepertoireImportWorker();
    worker.onmessage = () => resolve();
    worker.onerror = (err) => reject(err);
    worker.onmessageerror = (err) => reject(err);
    worker.postMessage(file);
  });

export const startExportRepertoireWorker = () =>
  new Promise<Uint8Array>((resolve, reject) => {
    const worker = new RepertoireExportWorker();
    worker.onmessage = async (event) => resolve(event.data);
    worker.onerror = reject;
    worker.onmessageerror = reject;
    worker.postMessage("start");
  });
