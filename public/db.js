importScripts("do_watermark.js")

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

function onFileWrite(path) {
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
