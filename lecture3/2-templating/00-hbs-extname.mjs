"use strict';"
//const express = require('express')
//const expressHandlebars = require('express-handlebars').engine

import express from 'express';
import { engine } from 'express-handlebars';


//const handlers = require('./lib/handlers')
import * as handlers from './lib/handlers.js'
//const weatherMiddlware = require('./lib/middleware/weather')
import * as weatherMiddlware from './lib/middleware/weather.js'

import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()

// configure Handlebars view engine
app.engine('hbs', engine({
  defaultLayout: '00-main',
  extname: '.hbs',
  helpers: {
    section: function(name, options) {
      if(!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'hbs');

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('00-home'));

app.listen(port, () => {
  console.log( `Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.' )
})
