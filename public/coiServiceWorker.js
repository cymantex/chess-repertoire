const STOCKFISH_CACHE = "stockfish-cache";

function isStockfishAsset(url) {
  return url.pathname.includes("/stockfish/");
}

function addCoiHeaders(response) {
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
}

const fetchEventListener = function (event) {
  const r = event.request;
  if (r.cache === "only-if-cached" && r.mode !== "same-origin") {
    return;
  }

  const request =
    r.mode === "no-cors" ? new Request(r, { credentials: "omit" }) : r;

  // Cache-first strategy for stockfish assets (.js and .wasm)
  if (isStockfishAsset(new URL(request.url))) {
    event.respondWith(
      caches.open(STOCKFISH_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) {
            return cached;
          }
          return fetch(request).then((response) => {
            const withCoi = addCoiHeaders(response);
            // Cache a clone since the response body can only be consumed once
            cache.put(request, withCoi.clone());
            return withCoi;
          });
        }),
      ).catch((e) => console.error(e)),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => addCoiHeaders(response))
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
