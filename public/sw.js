"use strict";

const APP_SCOPE_URL = new URL("./", self.registration.scope);
const APP_BASE_PATH = APP_SCOPE_URL.pathname;
const ENTRY_URL = APP_SCOPE_URL.href;
const CACHE_PREFIX = "rinemi2-app-shell:" + APP_BASE_PATH + ":";
const CACHE_NAME = CACHE_PREFIX + "v1";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache only the entry point during install. Bundled scripts, styles, fonts,
    // icon, manifest and data are cached as the controlled app requests them.
    await cache.add(ENTRY_URL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    // Clear only stale versions for this exact app scope. Another Rinemi
    // deployment on the same origin may have a different BASE_URL.
    await Promise.all(cacheNames
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_BASE_PATH)) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && url.pathname === APP_BASE_PATH) {
          const cache = await caches.open(CACHE_NAME);
          try {
            await cache.put(ENTRY_URL, response.clone());
          } catch {
            // Cache quota/private-mode failures must not break an online navigation.
          }
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return await cache.match(ENTRY_URL) ?? Response.error();
      }
    })());
    return;
  }

  // Network-first keeps deployments fresh while online; the previously fetched
  // response is used if the browser goes offline after the app has been warmed.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok && response.type !== "opaque") {
        try {
          await cache.put(request, response.clone());
        } catch {
          // Preserve the successful network response when storage is full/unavailable.
        }
      }
      return response;
    } catch {
      return await cache.match(request) ?? Response.error();
    }
  })());
});
