// GSIA QG - Mode Offline Sécurisé - Ne bloque jamais
const CACHE_NAME = 'gsia-qg-safe-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // On cache seulement ce qui existe sûr
      return cache.addAll(['./', './index.html']).catch(err => {
        console.log('Cache partiel OK', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request) || caches.match('./index.html');
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
