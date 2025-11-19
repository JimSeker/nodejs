"use strict";
// note, package.json has "type": "module" to enable ES modules, so we don't need to use .mjs extension
import express from 'express';
import { engine } from 'express-handlebars';
import { default as bodyParser } from 'body-parser';
import { configDotenv } from 'dotenv';
configDotenv(); //load the env file

import { default as handlers }  from './lib/handlers.js';
import cookieParser from 'cookie-parser';
import * as pokemon from 'pokemon';
import {default as db} from './db.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// configure Handlebars view engine
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// the following is needed for cookie support
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//most of this could be in the hanlders.js, but here just to show it. 
app.get('/', async (req, res) => {

  //get the userid from the cookie.
  var username = req.cookies.username;
  //if it doesn't exist, set one.
  if (username == "") {
    username = pokemon.random();
    res.cookie('username', username);
    console.log("new username chosen" + username);
  }

  //get all the scores for the username.
  const scoredata =  await db.getData(username);
  //now build the data structure for display.
  const context = {
    username: username,
    scoreinfo: scoredata.map (
      row => {
        return { 
          score: row,
        }
      }   
   )};
  console.log(context);
  //  //finally render the page with the data, hopefully
  res.render('home', context);

});

// handlers for browser-based form submission
//moved here, for cookies, 
app.get('/score-add', handlers.scoreAdd);
app.post('/score-add/process', handlers.scoreAddProcess);
app.get('/score-del', handlers.scoreDelete);
app.get('/score-others', handlers.scoreOther);

app.get('/set-random-username', (req, res) => {
  res.cookie('username', pokemon.random());
  res.redirect('/');
});


app.use(handlers.notFound);
app.use(handlers.serverError);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.');
});

