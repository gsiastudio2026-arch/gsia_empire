const CACHE_NAME='gsia-v122-4-ultra-vocale';
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(['/gsia_empire/','/gsia_empire/index.html'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
