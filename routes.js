/*****************
 * App
 */
importScripts("db.js")
importScripts("jszip.js")


app = new Router()

app.get("/files/*", (req, res) => {
  let path = getDBPathFromUrl(req.url);
  res.send(
    readtheDatafromIndexedDb(
      "files",
      path,
    )
      .then(response => { 
        return response; 
      })
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
           setTimeout(onFileWrite, 2000, path);
            resolve(new Response({ path: path }));
          }
        })
    })
  );
});

app.post("/download_all", (req, res) => {
  const zip = new JSZip();
  const tx = db.transaction("files", "readwrite");
  const store = tx.objectStore("files");
  const get_all_request = store.getAll();
  res.send(new Promise((resolve, reject) => {
    get_all_request.onsuccess = (event) => {
      const get_all_keys_request = store.getAllKeys();
      get_all_keys_request.onsuccess = (event)=> {
        create_zip(zip,get_all_keys_request.result, get_all_request.result).then(()=>{
          zip.generateAsync({type:"uint8array"}).then(content=>{
            resolve(new Response(content));
          });
        });
      }
    }
  }));
});

const create_zip = async (zip,keys,blob_files) => {
  let i = 0
  for (let file of blob_files){
    let imgData = await file.arrayBuffer();
    zip.file(keys[i], imgData, {base64: true});
    i+=1;
  }
}

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

app.delete("/files/*", (req, res) => {
    let path = getDBPathFromUrl(req.url);
    res.send(
      new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readwrite");
        const store = tx.objectStore("files");
        let request = store.delete(path);
        request.onsuccess = successEvent => {
            resolve(new Response({ path: path }));
        }
    })
    .then(response => { return response; })
    );
});
