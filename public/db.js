importScripts("hustle.js")

const request = indexedDB.open("myApp", 3);
let db;

var hustle   =   new Hustle({
    db_name: 'hustle',
    db_version: 1,
    housekeeping_delay: 1000,
    message_lifetime: 1000,
    tubes: ['watermarking']
});
hustle.open()

request.onupgradeneeded = function () {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  let filesStore = db.createObjectStore("files");
  let dataStore = db.createObjectStore("data");
  //let watermarkingQ = db.createObjectStore("watermarkingQ");
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

function onFileWrite(path) {
    if (path.startsWith("/withoutWatermark/")) {
        hustle.Queue.put({path: path}, {
            tube: 'watermarking',
            ttr: 2,
            success: function(item) {
                console.log('added item: ', item.id);
            },
            error: function(e) {
                console.error('failed to add job: ', e);
            }
        });
    }
}
 