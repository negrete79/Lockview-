const CACHE = 'meu-carro-painel-v3';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icones/icon-192.png',
  './icones/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE ? caches.delete(k) : null))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('supabase.co') || e.request.url.includes('nominatim.openstreetmap.org') || e.request.url.includes('unpkg.com') || e.request.url.includes('google.com/vt')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
