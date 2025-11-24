"use strict";

import express from 'express';
import { engine } from 'express-handlebars';

import * as handlers from './lib/handlers.js'

import weatherMiddlware from './lib/middleware/weather.js'

import { configDotenv } from 'dotenv';
configDotenv(); //load the env file

// Create __dirname equivalent for ES modules
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(weatherMiddlware);

app.get('/', handlers.home);
app.get('/section-test', handlers.sectionTest);

app.use(handlers.notFound);
app.use(handlers.serverError);

const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log( `Express started on http://localhost:${port}` +
      '; press Ctrl-C to terminate.' )
  })

