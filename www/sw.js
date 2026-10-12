// [SW100] Service Worker: Provides offline capability, asset caching, and request interception.

const CACHE_NAME = 'synth-wave-td-v1.36.19';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './fonts.css',
  './data.js',
  './levels_data.js',
  './engine.js',
  './ui.js',
  './audio.js',
  './music.js',
  './sfx-manifest.js',
  './telemetry.js',
  './favicon-16.png',
  './favicon-32.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// [SW101] Install Phase: Pre-cache static assets & skip waiting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// [SW102] Activate Phase: Purge outdated caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// --- Helper: Identify Telemetry & Analytics Requests -----------------------
function isTelemetryRequest(request) {
  const url = request.url;
  return request.method !== 'GET' ||
         url.includes('google-analytics') ||
         url.includes('analytics') ||
         url.includes('telemetry') ||
         url.includes('discord.com/api/webhooks');
}

// [SW103] Fetch Phase: Request Interception & Caching Strategy
self.addEventListener('fetch', (event) => {
  // Telemetry pings follow Network-Only policy with silent failure
  if (isTelemetryRequest(event.request)) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(null, { status: 204, statusText: 'No Content' });
      })
    );
    return;
  }

  // Static app assets follow Network-First strategy, falling back to cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
