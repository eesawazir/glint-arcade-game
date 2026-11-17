// GLINT service worker - makes the game fully playable with no network connection
// after it has been opened online at least once.
const VERSION = "glint-v1.2";
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n !== VERSION).map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const save = (req, res) => {
  if (res && (res.ok || res.type === "opaque")) {
    const copy = res.clone();
    caches
      .open(VERSION)
      .then((cache) => cache.put(req, copy))
      .catch(() => {});
  }
  return res;
};

// Game page: try the network first so new deploys show up.
// Fall back to the saved copy if offline or slower than 3 seconds.
// Everything else (icons, fonts): use the saved copy, refresh in the background.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isPage =
    req.mode === "navigate" ||
    (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname));

  if (isPage) {
    e.respondWith(
      new Promise((resolve) => {
        let done = false;
        const fallback = () =>
          caches
            .match(req)
            .then((c) => c || caches.match("./index.html"))
            .then((c) => {
              if (!done && c) {
                done = true;
                resolve(c);
              }
              return c;
            });
        const timer = setTimeout(fallback, 3000);
        fetch(req, { cache: "no-cache" })
          .then((res) => {
            clearTimeout(timer);
            save(req, res);
            if (!done) {
              done = true;
              resolve(res);
            }
          })
          .catch(() => {
            clearTimeout(timer);
            fallback().then((c) => {
              if (!done) {
                done = true;
                resolve(c || Response.error());
              }
            });
          });
      }),
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => save(req, res))
        .catch(() => cached);
      return cached || network;
    }),
  );
});
