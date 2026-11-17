// Service Worker for Kvestefi PWA (iOS & Desktop)
const CACHE_NAME = 'kvestefi-v5-1-0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './css/components.css',
  './js/app.js',
  './js/supabase.js',
  './js/store.js',
  './js/data.js',
  './js/audio.js',
  './js/views/home.js',
  './js/views/subjects.js',
  './js/views/quiz.js',
  './js/views/competitions.js',
  './js/views/duels.js',
  './js/views/chat.js',
  './js/views/support.js',
  './js/views/profile.js',
  './js/views/developer.js',
  './js/views/settings.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/favicon.png',
  './assets/readyid_logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Supabase API requests: Network only, with fallback
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Tasks bank json: Cache first, then network
  if (url.pathname.includes('tasks_bank')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // App shell: Stale-while-revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return cached;
      });

      return cached || fetchPromise;
    })
  );
});
