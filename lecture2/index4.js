"use strict";
// the package.json file sets "type": "module" to use ES modules.  so .jms file extensions
// are not required.

import { configDotenv } from 'dotenv';
configDotenv(); //load the env file
//const express = require('express');
import express from 'express';
import { engine } from 'express-handlebars';

const app = express();

// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.render('home'));

const fortunes = [
  "Conquer your fears or they will conquer you.",
  "Rivers need springs.",
  "Do not fear what you don't know.",
  "You will have a pleasant surprise.",
  "Whenever possible, keep it simple.",
];

app.get('/about', (req, res) => {
  const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)];
  res.render('about', { fortune: randomFortune });
});

// custom 404 page
app.use((req, res) => {
  res.status(404);
  res.render('404');
});

// custom 500 page
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500);
  res.render('500');
});

app.listen(port, () => console.log(
  `Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate.`));