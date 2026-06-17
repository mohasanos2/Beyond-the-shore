const CACHE_NAME = 'bts-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/faq.html',
  '/booking.html',
  '/css/style.css',
  '/js/app.js',
  '/js/api.js',
  '/js/config.js',
  '/images/logo.png',
  '/images/favicon.ico'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache admin pages, JS files, or API calls
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache first for images and fonts only
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
