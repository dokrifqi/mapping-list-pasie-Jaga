// Tidak perlu mengubah file ini saat index.html diganti. Halaman utama selalu diambil dari server dulu (kalau online).
const VERSION = 'v4';
const SHELL = 'shell-' + VERSION;
const RUNTIME = 'runtime-fonts';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!same && !font) return;
  const isPage = req.mode === 'navigate' || (same && (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')));

  e.respondWith((async () => {
    const cache = await caches.open(font ? RUNTIME : SHELL);

    if (isPage) {
      // Halaman utama: server dulu supaya selalu versi terbaru, cache hanya untuk offline.
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res && res.ok) {
          const copy = res.clone();
          cache.put('./index.html', copy.clone());
          cache.put('./', copy);
        }
        return res;
      } catch (err) {
        const fb = (await cache.match('./index.html')) || (await cache.match('./'));
        if (fb) return fb;
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    }

    // File lain (ikon, font): cache dulu, lalu perbarui di latar belakang.
    const hit = await cache.match(req);
    const net = fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    const res = await net;
    return res || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  })());
});
