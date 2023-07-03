var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var config = {
  staticPath: "./",
  listen_port: 80,
  homeFile: "index.html",
  cors: true,
  defaultFile: [
    "index.shtml",
    "index.html",
    "index.htm",
    "default.htm",
    "default.html",
    "home.html",
  ],
  gzip: true,
  cache: true,
  contentType: {
    css: "text/css",
    gif: "image/gif",
    html: "text/html",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    pdf: "application/pdf",
    png: "image/png",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    tiff: "image/tiff",
    txt: "text/plain",
    wav: "audio/x-wav",
    wma: "audio/x-ms-wma",
    wmv: "video/x-ms-wmv",
    xml: "text/xml",
  },
};

http
  .createServer(function (request, response) {
    var pathName = path.normalize(url.parse(request.url).pathname);
    var fullPath =  path.join(config.staticPath , pathName);
    var extName = path.extname(pathName).toLowerCase(); // .js
    var extName2 = extName.replace(".", "");
    var fileName = path.basename(pathName, extName);

    if (!fileName) {
      var isfix = false;
      for (var i = 0; i < config.defaultFile.length; i++) {
        if (fs.existsSync(fullPath + config.defaultFile[i])) {
          fullPath = fullPath + config.defaultFile[i];
          isfix = true;
          break;
        }
      }
      if (!isfix) {
        fullPath = fullPath + config.defaultFile[0];
      }
    }

    console.log(fullPath);
    if (!fs.existsSync(fullPath)) {
      if (!config.cors) {
        response.writeHead(400, { "Content-Type": "text/html" });
        response.end(
          "<h1>404 not found<br />File " + pathName + "  not found.<h1>"
        );
        return;
      } else {
        pathName = config.homeFile;
        fullPath = config.staticPath + pathName;
        extName = path.extname(pathName).toLowerCase(); // .js
        extName2 = extName.replace(".", "");
        fileName = path.basename(pathName, extName);
      }
    }
    fs.readFile(fullPath, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, {
          "Content-Type": "text/plain",
        });
        response.end(err.toString());
      } else {
        var _contentType = "text/html";
        if (extName2 && config.contentType[extName2]) {
          _contentType = config.contentType[extName2];
        }
        response.writeHead(200, {
          "Content-Type": _contentType,
        });
        response.write(file, "binary");
        response.end();
      }
    });
  })
  .listen(config.listen_port);
console.log("listing port %d .", config.listen_port);
