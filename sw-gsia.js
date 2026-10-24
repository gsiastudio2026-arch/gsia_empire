// GSIA EMPIRE - sw-gsia.js V122.2 - FIX OFFLINE DEFINITIF + AÏNA
// Supprime le message "Vous êtes hors connexion" - Affiche toujours l'app

const CACHE_NAME = 'gsia-empire-v122-2-aina-fix';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './aina.html',
  './manifest.json',
  './gsia_new_512.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// INSTALL - Met en cache tout
self.addEventListener('install', event => {
  console.log('[GSIA SW V122.2] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[GSIA SW] Cache ouvert');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[GSIA SW] Tous les fichiers en cache - Aïna prête');
        return self.skipWaiting();
      })
  );
});

// ACTIVATE - Nettoie les anciens caches
self.addEventListener('activate', event => {
  console.log('[GSIA SW V122.2] Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[GSIA SW] Suppression ancien cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH - LA PARTIE QUI FIXE "Vous êtes hors connexion"
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 1. Si en cache, on renvoie direct (OFFLINE OK)
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2. Sinon on essaie le réseau
        return fetch(event.request)
          .then(networkResponse => {
            // On met en cache la réponse réseau pour la prochaine fois
            return caches.open(CACHE_NAME).then(cache => {
              // Ne pas mettre en cache les requêtes non-GET ou chrome-extension
              if (event.request.method === 'GET' && !event.request.url.startsWith('chrome-extension')) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            });
          })
          .catch(() => {
            // 3. OFFLINE ET PAS EN CACHE -> RENVOIE INDEX.HTML (PAS LA PAGE ERREUR)
            console.log('[GSIA SW] Offline, renvoi index.html avec Aïna');
            // Pour les pages HTML, renvoie index.html
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            // Pour le reste, renvoie une réponse vide mais pas la page d'erreur Chrome
            return new Response('', { status: 200, statusText: 'GSIA Offline' });
          });
      })
  );
});

// Message pour forcer update
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('✅ GSIA SW V122.2 - Aïna IA Active - Fix Hors Connexion Installé');
