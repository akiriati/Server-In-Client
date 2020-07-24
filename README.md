This is a POC project that dmonstrates how you can create an app which is fully serverless. And by serverless, we mean - no server at all!
Instead, we've created the full server architecture in the browser.

![architecture](https://user-images.githubusercontent.com/10947653/87656946-d73c5800-c762-11ea-92f6-60ca4bb5bf55.png)

## Watermark app
The watermark up is a good demonstartion of the server in client abilities. The app requires:
* Highly available server 
* Work offline
* Consistent Data
* Upload / Download Files
* Background operations

You can see this full functioning app [here](http://akiriati.github.io/Server-In-Client)

## How to configure your server?

### Create routes
Routes use the same notion as express.js. You should configure them in `routes.js`
```javascript
  app.post("/data/*", (req, res) => {
   ...
  });


  app.get("/files/*", (req, res) => {
   ...
  });
```

for example:
```javascript
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
```

### Background tasks
The server is a single-threaded based with event loop. All handlers should use async calls for IO. However, if you still need to run long task you can do this by defining workers to handle tasks that are consumed from a queue

#### Start consumers 
````javascript 
for(var i=0; i < 5; i++){
  new Worker('watermarkingWorker.js');
}
````

#### Producer code example
```javascript
hustle.Queue.put({path: path}, {
            tube: 'watermarking',
            ttr: 3,
});
```
#### Consumer code example
```javascript
var consumer = new hustle.Queue.Consumer(fn, {
      tube: 'watermarking',
      delay: 100,
});

fn = () => {...}
```

### Serving

#### Caching
Other resources that don't match any route, will be fetched from the server, and cached for future usage.
```javascript
caches.match(req).then(match => {
  return fetch(req).then(response => {
    return caches.open("resources").then(cache => cache.put(req, response.clone())).then(()=>
      response
    )
  }).catch(()=> match);
```

#### Deploy react-app to Github Pages
1. Install GitHub Pages - `npm install gh-pages --save-dev`
2. Add properties to `package.json` file - `"http://{username}.github.io/{repo-name}"` and  in the existing scripts property we to need to add predeploy and deploy.
```
"scripts": {
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
}
```
3.deploy - `npm run deploy`
 
### Front end
Front end code is fully decoupled from server implementation. `fetch` and resource fetching should be working natively.

#### Fetch
```javascript
 handleDeleteFile = (path) => {
      fetch(path, { method: 'DELETE' })
        .then(this.fetchImageListFromServer())
  }
```
#### Resources 
```javascript
<img src="/files/withoutWatermark/..." />
```
