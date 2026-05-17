const VERSION = 'v1';
const CACHE = `bpai-nai-${VERSION}`;

const PRECACHE = [
  './thai-app.html',
  './thai-app.css',
  './thai-app.js',
  './manifest.json',
  './icon.svg',
];

// Install: cache all static assets upfront
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first for same-origin assets, network-only for external
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Let external requests (fonts, TTS API) go straight to network
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        // Cache successful GET responses
        if (response.ok && request.method === 'GET') {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return cached thai-app.html for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('./thai-app.html');
        }
      });
    })
  );
});
