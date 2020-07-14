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