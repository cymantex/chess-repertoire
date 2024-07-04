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
self.addEventListener("message", (ev) => {
  if (ev.data.type === "deregister") {
    self.registration
      .unregister()
      .then(() => {
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
      });
  }
});
self.addEventListener("fetch", fetchEventListener);
