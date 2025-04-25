"use strict";

import { default as http } from 'http';  //ES6 module format.
const port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
   res.writeHead(200, {'Content-Type': 'text/plain' });
   res.end('Hello World!');
});

server.listen(port, () => console.log(`server started on port ${port}; ` +
  'press Ctrl-C to terminate ....'));
