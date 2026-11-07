/* Biblia del Ingeniero Industrial — Service Worker (funciona sin conexión)
   Ubicado en /biblia/ → su alcance es solo /biblia/, aislado de las otras apps del repositorio.
   Todas las apps comparten el mismo dominio y su almacenamiento de caché: este SW solo crea y borra cachés que empiezan con «biblia-».
   - La app (HTML): red primero, para recibir actualizaciones; sin conexión usa la copia guardada.
   - Librerías y fuentes externas (KaTeX, Google Fonts, pdfmake): se guardan la primera vez que se usan. */
const CACHE = 'biblia-v1';
const CDN = 'biblia-cdn-v1';
const ASSETS = ['./', 'index.html', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
const EXT = ['https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js'];
const EXT_HOSTS = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))),
    caches.open(CDN).then(c => Promise.allSettled(EXT.map(u => c.add(new Request(u, { mode: 'no-cors' })))))
  ]).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.map(k => (k.startsWith('biblia-') && k !== CACHE && k !== CDN) ? caches.delete(k) : null)))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (_) { return; }

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate' || url.pathname.endsWith('/biblia/') || url.pathname.endsWith('/biblia/index.html')) {
      e.respondWith(fetch(req)
        .then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put('index.html', c)); return res; })
        .catch(() => caches.match('index.html').then(m => m || caches.match('./'))));
      return;
    }
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res; })));
    return;
  }

  if (EXT_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open(CDN).then(c => c.match(req).then(m => {
      const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => m);
      return m || net;
    })));
  }
});
