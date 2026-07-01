/* Pastizzi Crush — service worker (network-first, offline fallback) */
const CACHE = 'pastizzi-v23';
const ASSETS = ['.', 'index.html', 'css/styles.css', 'js/game.js', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'js/lib/confetti.min.js', 'assets/logo.png', 'assets/p-irkotta.png', 'assets/p-pizelli.png', 'assets/pizza.png', 'assets/imqaret.png', 'assets/qaghaq.png', 'assets/figolla.png', 'assets/voice-title.mp3', 'assets/voice-mela.mp3', 'assets/voice-prosit.mp3'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return res; }).catch(() => caches.match(e.request).then(h => h || caches.match('index.html'))));
});
