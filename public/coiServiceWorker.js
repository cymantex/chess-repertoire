const fetchEventListener = function (event) {
  const r = event.request;
  if (r.cache === "only-if-cached" && r.mode !== "same-origin") {
    return;
  }

  const request =
    r.mode === "no-cors" ? new Request(r, { credentials: "omit" }) : r;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 0) {
          return response;
        }

        const headers = new Headers(response.headers);
        headers.set("Cross-Origin-Embedder-Policy", "credentialless");
        headers.set("Cross-Origin-Opener-Policy", "same-origin");

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      })
      .catch((e) => console.error(e)),
  );
};

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);
self.addEventListener("message", (event) => {
  if (event.data.type === "deregister") {
    self.registration.unregister().then(() => {
      event.source.postMessage({ type: "deregistered" });
    });
  }
});
self.addEventListener("fetch", fetchEventListener);
