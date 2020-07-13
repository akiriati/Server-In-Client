importScripts("do_watermark.js")
/*****************
 * DB
 */

const request = indexedDB.open("myApp", 3);
let db;

request.onupgradeneeded = function () {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  let filesStore = db.createObjectStore("files");
  let dataStore = db.createObjectStore("data");
};

request.onsuccess = function () {
  db = request.result;
};

request.onerror = event => {
  console.log(event.error)
};

function readtheDatafromIndexedDb(storeName, key) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction(storeName, "readwrite");
    var store = transaction.objectStore(storeName);
    var request = store.get(key);
    request.onerror = function () {
      reject("unexpected error happened");
    }
    request.onsuccess = function (e) {
      response = null;
      if (storeName == "files") {
        response = new Response(request.result, { 'content-type': 'image/png' })
      } else {
        response = new Response(JSON.parse(request.result))
      }
      resolve(response);
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
        return handler.fn(req, res)
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
      "files",
      path,
    )
      .then(response => { return response; })
  )
});

app.get("/data/*", (req, res) => {
  let path = getDBPathFromUrl(req.url);
  res.send(
    readtheDatafromIndexedDb(
      "data",
      path,
    )
      .then(response => { return response; })
  )
});

app.post("/files/*", (req, res) => {
  let path = getDBPathFromUrl(req.url);
  res.send(
    new Promise((resolve, reject) => {
      req.blob().then(
        data => {
          const tx = db.transaction("files", "readwrite");
          const store = tx.objectStore("files");
          let request = store.put(data, path);
          request.onsuccess = successEvent => {
            setTimeout(OnFileWrite, 3000, path);
            resolve(new Response({ path: path }));
          }
        })
    })
  );
});

app.post("/list", (req, res) => {
  let path = getDBPathFromUrl(req.url);
  res.send(
    new Promise((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      const store = tx.objectStore("files");
      var request = store.getAllKeys();
      request.onsuccess = successEvent => {
        resolve(new Response(JSON.stringify({ files: request.result })));
      }
    })
    .then(response => { return response; })
  );
});

function OnFileWrite(path) {
  if (path.startsWith("/withoutWatermark/")) {
    let fileName = path.replace("/withoutWatermark/", "") 
    let transaction = db.transaction("files", "readwrite");
    let store = transaction.objectStore("files");
    let request_watermark = store.get("/watermark.png");
    request_watermark.onsuccess = successEvent => {
      let request_file = store.get("/withoutWatermark/" + fileName);
      request_file.onsuccess = successEvent => {           
        image_script(request_watermark.result, request_file.result).then(imageUri=> fetch(imageUri)).then(res => res.blob()).then(blob => {
          let transaction2 = db.transaction("files", "readwrite");
          let store = transaction2.objectStore("files");
          request_save = store.put(blob, "/withWatermark/" + fileName);
          request_save.onsuccess = successEvent => {   
            request_delete = store.delete("/withoutWatermark/" + fileName);
            request_delete.onsuccess = successEvent => {
            }
          }
        });
      }
    }
  }
}


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
  return app.execute(event.request.method, getPathFromUrl(event.request.url), event.request.clone(), new ResponseWrapper(event));
});

