"use strict";
import { default as http } from 'http';  //ES6 module format.

import fs from 'fs';  //ES6 module format.
//import * as fs from 'fs';

const port = process.env.PORT || 3000;

import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function serveStaticFile(res, path, contentType, responseCode = 200) {
  fs.readFile(__dirname + path, (err, data) => {
    if(err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('500 - Internal Error');
    }
    res.writeHead(responseCode, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req,res) => {
    const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch(path) {
      case '':
        serveStaticFile(res, '/public/home.html', 'text/html');
        break;
      case '/about':
        serveStaticFile(res, '/public/about.html', 'text/html');
        break;
      case '/img/logo.png':
        serveStaticFile(res, '/public/img/logo.png', 'image/png');
        break;
      default:
        serveStaticFile(res, '/public/404.html', 'text/html', 404);
        break;
    }  });
  
server.listen(port, () => console.log(`server started on port ${port}; ` +
    'press Ctrl-C to terminate....'));