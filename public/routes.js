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
            setTimeout(onFileWrite, 1000, path);
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
