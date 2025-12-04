// Verhoog de versie wanneer je belangrijke updates doet
const CACHE_NAME = 'berniev-cache-v2';

const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // eventueel aanvullen met vaste assets zoals covers, fonts, etc.
];

// Install: basisbestanden cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: oude caches opruimen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: 
// - voor HTML (navigaties) → eerst netwerk, dan cache als fallback
// - voor andere bestanden → cache-first (zoals nu)
self.addEventListener('fetch', event => {
  const request = event.request;
  const acceptHeader = request.headers.get('accept') || '';

  const isHtmlRequest =
    request.mode === 'navigate' ||
    acceptHeader.includes('text/html');

  if (isHtmlRequest) {
    // HTML: network-first
    event.respondWith(
      fetch(request)
        .then(response => {
          // nieuwe versie in cache stoppen
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // als offline: probeer uit cache
          return caches.match(request);
        })
    );
  } else {
    // Overige bestanden: cache-first, dan netwerk
    event.respondWith(
      caches.match(request).then(cached => {
        return (
          cached ||
          fetch(request).then(response => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          })
        );
      })
    );
  }
});