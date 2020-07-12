const request = indexedDB.open("myApp", 2);
let db;

request.onupgradeneeded = function() {
  // The database did not previously exist, so create object stores and indexes.
  const db = request.result;
  db.createObjectStore("files");
  db.createObjectStore("data");
};

request.onsuccess = function() {
  db = request.result;
};

request.onerror = event => {
    console.log(event.error)
  };
  
addEventListener('fetch', function(event) {
  
  const method = event.request.method;
  let parts = new URL(event.request.url).pathname.split("/");
  parts.shift();
  const table = parts.shift();
  const path = parts.join("/");


  switch(method) {
      case "GET":
          if (table == "files" || table == "data") {
            headers = (table == "files")? { 'content-type':'image/png' } : {}
            event.respondWith( 
              readtheDatafromIndexedDb(db, table, path, headers).then(response => {return response;})
            )
          } else {
            return false;
          }
          break;

      case "POST":
        switch (table) { 
          case "files":
            request.formData().then(data => {console.log(data)})
            event.respondWith(
              event.request.blob().then(
                  data => {
                      const tx = db.transaction(table, "readwrite");
                      const store = tx.objectStore(table);          
                      let request = store.put(data, path);
                      request.onsuccess = successEvent => {
                        return {"file" : path};
                      }

                  }
              )
            );
            break;
    

          case "data":
            event.request.blob().then(
              data => {
                  const tx = db.transaction(table, "readwrite");
                  const store = tx.objectStore(table);          
                  store.put(data, path);
              }
            );
            break;

          case "addNewPicId":
            request.formData().then(data => {
              const tx = db.transaction(table, "readwrite");
              const store = tx.objectStore(table);
              readtheDatafromIndexedDb(db, table, path, headers).then(response =>
                {
                  store.put(response.append(data.picId))
                })
            })


          default:
            return false;
    

          
        
        }


  }
  
});

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
        resolve(new Response( request.result, { headers: headers } ));
    }
  })
}