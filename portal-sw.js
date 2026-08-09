/* Portal de Estudio 4.0 — Service Worker (modo offline)
   El HTML es autocontenido (contenido + imágenes embebidas), así que
   cachear el propio archivo basta para funcionar sin conexión. */
const CACHE = 'portal-v4-1';
const ASSETS = [
  'PORTAL_ESTUDIO.html',
  'portal.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-180.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
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
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;   // no tocar recursos externos

  // App/HTML: red primero (para recibir actualizaciones), cae a caché sin conexión
  if (req.mode === 'navigate' || url.pathname.endsWith('PORTAL_ESTUDIO.html')) {
    e.respondWith(
      fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res; })
        .catch(() => caches.match(req).then(m => m || caches.match('PORTAL_ESTUDIO.html')))
    );
    return;
  }
  // Resto (íconos, manifiesto): caché primero
  e.respondWith(
    caches.match(req).then(m => m || fetch(req).then(res => {
      const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res;
    }).catch(() => m))
  );
});
