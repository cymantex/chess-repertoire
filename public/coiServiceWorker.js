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

function broadcastMessage(msg) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(msg));
  });
}

async function fetchWasmWithProgress(request) {
  const response = await fetch(request);
  const contentLength = response.headers.get("Content-Length");
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  // If we can't determine the size or there's no body, fall back
  if (!total || !response.body) {
    return response;
  }

  broadcastMessage({ type: "wasm-download-start", total });

  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    broadcastMessage({ type: "wasm-download-progress", loaded, total });
  }

  broadcastMessage({ type: "wasm-download-complete" });

  const body = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.length;
  }

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
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
          return fetchWasmWithProgress(request).then((response) => {
            const withCoi = addCoiHeaders(response);
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
