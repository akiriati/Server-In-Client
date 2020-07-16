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
