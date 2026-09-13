/**
 * AgroBey - Service Worker PWA
 * Gestion du cache hors-ligne, rapidité d'affichage et installation sur mobile.
 */

const CACHE_NAME = 'agrobey-pwa-v1.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './assets/css/style.css',
  './assets/js/config.js',
  './assets/js/db.js',
  './assets/js/map_engine.js',
  './assets/js/auth.js',
  './assets/js/marketplace.js',
  './assets/js/seller.js',
  './assets/js/delivery.js',
  './assets/js/support.js',
  './assets/js/admin.js',
  './assets/js/app.js',
  './assets/logo.jpg'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('AgroBey PWA: Erreur mineure pré-cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache : Network First avec fallback sur Cache pour garantir la fraîcheur
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET et les requêtes Chrome extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache la réponse fraîche si valide
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas de coupure internet, servir depuis le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si la page principale est demandée sans réseau
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
