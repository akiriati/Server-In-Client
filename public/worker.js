importScripts("do_watermark.js")
importScripts("db.js")
importScripts("hustle.js")

handleTask = (task) => {
    let transaction = db.transaction("files", "readwrite");
    let store = transaction.objectStore("files");
    let request_watermark = store.get("/watermark.png");
    request_watermark.onsuccess = successEvent => {
        let request_file = store.get(task.data.path);
        request_file.onsuccess = successEvent => {
            image_script(request_watermark.result, request_file.result).then(imageUri => fetch(imageUri)).then(res => res.blob()).then(blob => {
                let transaction2 = db.transaction("files", "readwrite");
                let store = transaction2.objectStore("files");
                request_save = store.put(blob, task.data.path.replace("withoutWatermark", "withWatermark"));
                request_save.onsuccess = successEvent => {
                    request_delete = store.delete(task.data.path);
                    request_delete.onsuccess = successEvent => {
                    }
                }
            });
        }
    }
}

var consumer = new hustle.Queue.Consumer(handleTask, {
    tube: 'watermarking',
    delay: 100,
});
