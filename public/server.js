importScripts("router.js")
importScripts("routes.js")

class ResponseWrapper {
  constructor(event) {
    this.event = event
  }

  send(payload) {
    this.event.respondWith(payload)
  }
}
/*****************
 * Event listener
 */

addEventListener('fetch', function (event) {
  app.execute(event.request.method, getPathFromUrl(event.request.url), event.request.clone(), new ResponseWrapper(event));

});

self.skipWaiting()
console.log(" web service reloaded")

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return true
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});