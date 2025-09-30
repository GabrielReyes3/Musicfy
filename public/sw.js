// sw.js (root)
const STATIC_CACHE = "musicfy-static-v1";
const RUNTIME_CACHE = "musicfy-runtime-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/main.js",
  "/manifest.json",
  "/images/logo.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // API requests (itunes) -> network-first, then cache
  if (url.hostname.includes("itunes.apple.com")) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Audio (preview urls) -> cache-first
  if (req.destination === "audio") {
    event.respondWith(cacheFirst(req));
    return;
  }

  // static assets -> cache-first
  if (APP_SHELL.includes(url.pathname) || req.destination === "image" || req.destination === "script" || req.destination === "style") {
    event.respondWith(cacheFirst(req));
    return;
  }

  // default network fallback to cache
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});

async function cacheFirst(req) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (err) {
    return caches.match("/index.html");
  }
}

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    return new Response(JSON.stringify({ results: [] }), { headers: { "Content-Type": "application/json" }});
  }
}
