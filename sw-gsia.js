// SW GSIA V122.1 - VERSION ANTI-BLOCAGE - NE BLOQUE JAMAIS
const CACHE = 'gsia-v122-safe';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.add('./').catch(()=>{})).then(()=>self.skipWaiting())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match('./')))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});
