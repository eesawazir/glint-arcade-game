// GLINT service worker - makes the game fully playable with no network connection
// after it has been opened online at least once.
const VERSION = 'glint-v1.1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Cache-first for everything in scope (including cross-origin font requests),
// falling back to the network, and updating the cache with whatever the
// network returns so the game stays current when online.
// If a navigation request fails outright (fully offline, nothing cached yet
// for that exact URL), fall back to the cached index.html shell.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request)
        .then((res) => {
          if (res && (res.ok || res.type === 'opaque')) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(e.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          if (e.request.mode === 'navigate') return caches.match('./index.html');
          return cached;
        });
      return cached || network;
    })
  );
});