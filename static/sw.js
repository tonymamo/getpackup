// This service worker unregisters itself to remove offline caching

// This is necessary to clear out old service workers that were causing issues
self.addEventListener('install', function (event) {
  // Skip waiting to activate immediately
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil(
    // Unregister this service worker
    self.registration
      .unregister()
      .then(function () {
        // Clear all caches
        return caches.keys().then(function (cacheNames) {
          return Promise.all(
            cacheNames.map(function (cacheName) {
              return caches.delete(cacheName);
            })
          );
        });
      })
      .then(function () {
        // Force reload all clients to get fresh content
        return self.clients.matchAll();
      })
      .then(function (clients) {
        clients.forEach(function (client) {
          client.navigate(client.url);
        });
      })
  );
});
