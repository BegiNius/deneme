const CACHE_VERSION = 'v2';
const CACHE_NAME = `site-cache-${CACHE_VERSION}`;
const ASSETS = [
  '/',
  'index.html',
  'main.css',
  'main.js',
  'guide.js',
  'sections.html',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse =>
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
        )
        .catch(() => cachedResponse);

      event.waitUntil(fetchPromise);

      return cachedResponse || fetchPromise;
    })
  );
});
