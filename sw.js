/**
 * Sterling Steffen — sw.js
 * Service worker for offline caching.
 *
 * Strategy:
 *   Precache  — HTML, CSS, JS downloaded and stored on first visit
 *   Fonts     — Google Fonts cached on first load, served from cache thereafter
 *   Images    — assets/* cached on first request (lazy, not precached)
 *   Else      — network only; fail silently
 *
 * ── TO UPDATE THE CACHE AFTER A SITE CHANGE ──────────────────────────────────
 *   Bump CACHE_VERSION below (e.g. 'v1' → 'v2').
 *   On the user's next visit the old cache is deleted and assets are re-fetched.
 */

const CACHE_VERSION  = 'v1';
const CACHE_STATIC   = `sterling-static-${CACHE_VERSION}`;
const CACHE_FONTS    = `sterling-fonts-${CACHE_VERSION}`;
const CACHE_IMAGES   = `sterling-images-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
];


// ── INSTALL ───────────────────────────────────────────────────────────────────
// Precache core assets immediately. skipWaiting so the new SW activates
// without waiting for existing tabs to close.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});


// ── ACTIVATE ─────────────────────────────────────────────────────────────────
// Delete any caches from previous versions. clients.claim() takes control of
// already-open pages immediately rather than waiting for a reload.
self.addEventListener('activate', event => {
  const currentCaches = new Set([CACHE_STATIC, CACHE_FONTS, CACHE_IMAGES]);

  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !currentCaches.has(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});


// ── FETCH ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // ── Google Fonts: cache-first ───────────────────────────────────────────────
  // Font files rarely change; serve from cache and update in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_FONTS).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached); // fall back to stale if network fails
        })
      )
    );
    return;
  }

  // ── Local images: cache on first load ──────────────────────────────────────
  // Covers assets/og-image.jpg and any future images.
  if (url.origin === self.location.origin && url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.open(CACHE_IMAGES).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // ── Static site assets: cache-first ────────────────────────────────────────
  // HTML, CSS, JS. Served from precache immediately; network fetch populates
  // anything that wasn't precached.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_STATIC).then(cache => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  }

  // Anything else (external scripts, analytics, etc.): network only, no caching.
});
