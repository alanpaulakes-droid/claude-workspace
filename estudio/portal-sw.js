/* Portal de Estudio 4.0 — Service Worker (modo offline)
   Ubicado en /estudio/ → su scope es SOLO /estudio/, aislado de Órbita (raíz).
   El HTML es autocontenido (contenido + imágenes embebidas), así que
   cachear el propio archivo basta para funcionar sin conexión. */
const CACHE = 'portal-estudio-v4-2';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'portal-icon-192.png',
  'portal-icon-512.png',
  'portal-icon-180.png'
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
  if (req.mode === 'navigate' || url.pathname.endsWith('/estudio/') || url.pathname.endsWith('/estudio/index.html')) {
    e.respondWith(
      fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res; })
        .catch(() => caches.match(req).then(m => m || caches.match('index.html')))
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
