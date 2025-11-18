"use strict";
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;
app.disable('x-powered-by');

app.get('*', (req, res) => {
  res.send(`Open your dev tools and examine your headers; ` +
    `you'll notice there is no x-powered-by header!`);
});


app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`));
