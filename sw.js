/* Bitácora — Service Worker (modo offline) */
const CACHE = 'orbita-v2';
const ASSETS = [
  'ORGANIZADOR_PERSONAL.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.map(k => k !== CACHE ? caches.delete(k) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                 // el conector usa POST: no tocar
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.hostname.includes('google')) return;      // nunca cachear Drive/Apps Script

  // App/HTML: red primero (para recibir actualizaciones), cae a caché si no hay internet
  if (req.mode === 'navigate' || url.pathname.endsWith('ORGANIZADOR_PERSONAL.html')) {
    e.respondWith(
      fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res; })
        .catch(() => caches.match(req).then(m => m || caches.match('ORGANIZADOR_PERSONAL.html')))
    );
    return;
  }

  // Resto (íconos, manifiesto): caché primero
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(res => {
      const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res;
    }))
  );
});
