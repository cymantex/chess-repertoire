import { useEffect, useRef, useState } from "react";

export interface WasmDownloadProgress {
  /** 0–100 */
  percent: number;
  downloading: boolean;
}

/**
 * Listens for progress messages broadcast by the coiServiceWorker when it
 * downloads the stockfish WASM from the network (cache miss).
 */
export const useWasmDownloadProgress = (): WasmDownloadProgress => {
  const [progress, setProgress] = useState<WasmDownloadProgress>({
    percent: 0,
    downloading: false,
  });

  // Keep a ref so the event listener always sees the latest state without
  // needing to re-register on every render.
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const { data } = event;

      if (data?.type === "wasm-download-start") {
        setProgress({ percent: 0, downloading: true });
      } else if (data?.type === "wasm-download-progress") {
        const percent = Math.round((data.loaded / data.total) * 100);
        setProgress({ percent, downloading: true });
      } else if (data?.type === "wasm-download-complete") {
        setProgress({ percent: 100, downloading: false });
      }
    };

    navigator.serviceWorker?.addEventListener("message", handler);
    return () => {
      navigator.serviceWorker?.removeEventListener("message", handler);
    };
  }, []);

  return progress;
};

