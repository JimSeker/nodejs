"use strict";

import express from 'express';
import { engine } from 'express-handlebars';
import { default as bodyParser } from 'body-parser';
import { default as expressSession } from 'express-session';
import { configDotenv } from 'dotenv';
configDotenv(); //load the env file


import { default as handlers } from './lib/handlers.js';
import { default as db } from './db.mjs';

import path from 'path';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// configure Handlebars view engine
app.engine('handlebars', engine({
  defaultLayout: 'main',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    },
  },
}))
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.cookieSecret, 
}));

//most of this could be in the hanlders.js, but here just to show it. 
app.get('/', async (req, res) => {
  const fb_data = await db.getData();

  //  //create the context variable with correct obj names hopefully.
  const context = {  username: req.session.username, listscores: fb_data };
  // console.log("did I get the data?");
  // console.log(context);
  //finally render the page with the data, hopefully
  res.render('home', context);

});

//login page
app.get('/login', (req, res) => {
  res.render('login', {});
});
//process the login.
app.post('/loginProcess', async (req, res) => {
  const email = req.body.email || '', password = req.body.password || '';
  // input validation
  if (email == '' || password == '') {
    console.log("email " + email + " or " + password + "invalid");
    return res.redirect(303, '/login');
  }
  //login the user, then redirect back to home page to see data.
  const user = await db.login(email, password);
  if (user) {
    req.session.username = user;
  }
  return res.redirect(303, '/')
});

//logout the user, then redirect back to home page to see data.
app.get('/logout', async (req, res) => {
  await db.logout();
  req.session.username = "";
  return res.redirect(303, '/')
});
// handlers for browser-based form submission
 app.get('/db-add', handlers.dbAdd)
 app.post('/db-add/process', handlers.dbAddProcess);
 app.get('/db-update', handlers.dbUpdate)
 app.post('/db-update/process', handlers.dbUpdateProcess);
 app.get('/db-del', handlers.dbDelete)
 app.post('/db-del/process', handlers.dbDeleteProcess);

app.use(handlers.notFound);
app.use(handlers.serverError);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.');
});

