"use strict";
require('dotenv').config();  //.env file.
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


// custom 404 page
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });
  
  // custom 500 page
  app.use((err, req, res, next) => {
    console.error(err.message);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
  });
  
  console.log(process.env);

  app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`));