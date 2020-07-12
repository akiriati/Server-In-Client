/*****************
 * DB
 */

const request = indexedDB.open("myApp", 2);
let db;

request.onupgradeneeded = function () {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  db.createObjectStore("files");
  db.createObjectStore("data");
};

request.onsuccess = function () {
  db = request.result;
};

request.onerror = event => {
  console.log(event.error)
};

function readtheDatafromIndexedDb(dbName, storeName, key, headers) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([storeName], "readwrite");
    var store = transaction.objectStore(storeName);
    var request = store.get(key);
    request.onerror = function () {
      reject("unexpected error happened");
    }
    request.onsuccess = function (e) {
      //JSON.parse(request.result)
      resolve(new Response(request.result, { headers: headers }));
    }
  })
}


/*****************
 * Router
 */

class Router {

  constructor() {
    this.handlers = [];
  }

  addHandler(method, route, fn) {
    this.handlers.push(
      {
        method: method,
        route: route,
        fn: fn
      }
    )
  }

  get = (route, fn) => {
    this.addHandler(
      "GET",
      route,
      fn
    )
  }

  post = (route, fn) => {
    this.addHandler(
      "POST",
      route,
      fn
    )
  }

  execute = (method, route, req, res) => {
    for (let handler of this.handlers) {
      if (handler.method == method && route.match(handler.route)) {
        handler.fn(req, res)
      }
    }
  }
}

getPathFromUrl = (url) => {
  let parts = new URL(url).pathname.split("/");
  parts.shift();
  return "/" + parts.join("/");
}

getDBPathFromUrl = (url) => {
  let parts = new URL(url).pathname.split("/");
  parts.shift();
  parts.shift();
  return "/" + parts.join("/");
}

/*****************
 * App
 */
app = new Router()

app.get("/files/*", (req, res) => {
  let path = getDBPathFromUrl(req.url);
  res.send(
    readtheDatafromIndexedDb(
      db,
      "files",
      path,
      { 'content-type': 'image/png' }
    )
      .then(response => { return response; })
  )
});

app.post("/files/*", (req, res) => {
  let path = getDBPathFromUrl(req.url);
  res.send(
    req.blob().then(
      data => {
        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        let request = store.put(data, path);
        request.onsuccess = successEvent => {
          return { "file": path };
        }

      }
    )
  );
});


class ResponseWrapper {
  constructor (event) {
    this.event = event
  }

  send (payload) {
    this.event.respondWith(payload)
  }
}

/*****************
 * Event listener
 */

addEventListener('fetch', function (event) {
  return app.execute(event.request.method, getPathFromUrl(event.request.url), event.request, new ResponseWrapper(event));
});
