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