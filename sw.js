// Network-first so headlines stay fresh; cached copy only used when offline. No user data is stored.
const C = 'news-desk-v1';
const SHELL = ['./', 'index.html', 'news.json', 'manifest.json', 'icon-192.png', 'apple-touch-icon.png', 'icon.svg'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  const u = new URL(e.request.url); const key = u.pathname.endsWith('news.json') ? 'news.json' : e.request;
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(C).then(c => c.put(key, copy)); } return r; })
    .catch(() => caches.match(key, { ignoreSearch: true })));
});
