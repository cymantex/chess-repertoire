import { saveGameAndReloadPage } from "@/app/zustand/initialize.ts";
import { createTimeoutPromise } from "@/common/utils/utils.ts";

const SERVICE_WORKER_CLIENT_URL = "/chess-repertoire/coiServiceWorker.js";

export const isCoiServiceWorkerRegistered = async (): Promise<boolean> => {
  const registration = await navigator.serviceWorker.getRegistration(
    SERVICE_WORKER_CLIENT_URL,
  );

  return !!registration && !!registration.active;
};

export const deregisterCoiServiceWorker = async () => {
  const registration = await navigator.serviceWorker.getRegistration(
    SERVICE_WORKER_CLIENT_URL,
  );

  if (registration && registration.active) {
    const deregisterPromise = new Promise<void>((resolve) => {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "deregistered") {
          console.log("coiServiceWorker deregistered.");
          resolve();
        }
      });
      registration.active!.postMessage({ type: "deregister" });
    });
    await Promise.race([createTimeoutPromise(5000), deregisterPromise]);
    saveGameAndReloadPage();
  } else {
    throw new Error("No active service worker to deregister.");
  }
};

export const registerCoiServiceWorker = async () => {
  // If we're already coi: do nothing. Perhaps it's due to this script doing
  // its job, or COOP/COEP are already set from the origin server. Also if the
  // browser has no notion of crossOriginIsolated, just give up here.
  if (window.crossOriginIsolated) {
    console.log(
      "coiServiceWorker not registered, already crossOriginIsolated.",
    );
    return;
  }

  if (!window.isSecureContext) {
    console.log(
      "coiServiceWorker not registered, a secure context is required.",
    );
    return;
  }

  // In some environments (e.g. Firefox private mode) this won't be available
  if (!navigator.serviceWorker) {
    console.error(
      "coiServiceWorker not registered, perhaps due to private mode.",
    );
    return;
  }

  return navigator.serviceWorker.register(SERVICE_WORKER_CLIENT_URL).then(
    (registration) => {
      console.log("coiServiceWorker registered", registration.scope);

      registration.addEventListener("updatefound", () => {
        console.log("Reloading page to make use of updated coiServiceWorker.");
        saveGameAndReloadPage();
      });

      // If the registration is active, but it's not controlling the page
      if (registration.active && !navigator.serviceWorker.controller) {
        console.log("Reloading page to make use of coiServiceWorker.");
        saveGameAndReloadPage();
      }
    },
    (err) => {
      console.error("coiServiceWorker failed to register:", err);
    },
  );
};
