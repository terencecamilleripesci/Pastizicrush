/* Pastizzi Crush — service worker (network-first, offline fallback) */
const CACHE = 'pastizzi-v43';
const ASSETS = ['.', 'index.html', 'css/styles.css', 'js/game.js', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'js/lib/confetti.min.js', 'assets/logo.png', 'assets/p-irkotta.png', 'assets/p-pizelli.png', 'assets/pizza.png', 'assets/imqaret.png', 'assets/qaghaq.png', 'assets/figolla.png', 'assets/voice-title.mp3', 'assets/voice-mela.mp3', 'assets/voice-prosit.mp3', 'assets/voice-nomatch.mp3', 'assets/menu1.mp3', 'assets/menu2.mp3', 'assets/menu3.mp3', 'assets/world1.jpg', 'assets/world2.jpg', 'assets/world3.jpg', 'assets/world4.jpg', 'assets/world5.jpg', 'assets/world6.jpg', 'assets/world7.jpg', 'assets/world8.jpg', 'assets/world9.jpg', 'assets/world10.jpg', 'assets/node.png', 'assets/nodelock.png', 'assets/play.png', 'assets/lives.png', 'assets/coins.png', 'assets/gear.png', 'assets/shop.png', 'assets/daily.png', 'assets/road.png', 'assets/path1.png', 'assets/path2.png', 'assets/path3.png', 'assets/path4.png', 'assets/path5.png', 'assets/path6.png', 'assets/path7.png', 'assets/path8.png', 'assets/path9.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return res; }).catch(() => caches.match(e.request).then(h => h || caches.match('index.html'))));
});
