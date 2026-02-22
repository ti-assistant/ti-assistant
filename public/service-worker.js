self.addEventListener("install", async (event) => {
  console.log("Service worker installed");

  const cache = await caches.open("test_cache_v1");

  event.waitUntil(
    await cache.addAll([
      "/api/base-data",
      "/api/base-data?locale=en",
      "/images/favicon.ico",
    ]),
  );
});

self.addEventListener("activate", (event) => {
  console.log("activate fired");
  return self.clients.claim();
});

self.addEventListener("fetch", async (event) => {
  // console.log("Fetch event", event.request);

  const responseFromCache = await caches.match(event.request);

  if (responseFromCache) {
    console.log("Found in cache", event.request);
    return responseFromCache;
  }

  return;
});
