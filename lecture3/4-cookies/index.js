"use strict";
// note, package.json has "type": "module" to enable ES modules, so we don't need to use .mjs extension
import express from 'express';
import { engine } from 'express-handlebars';
import { default as bodyParser } from 'body-parser';

import cookieParser from 'cookie-parser';
import { default as expressSession } from 'express-session';

import { default as handlers }  from './lib/handlers.js';
import { weatherMiddleware } from './lib/middleware/weather.js';

import { flashMiddleware } from './lib/middleware/flash.js';
import * as pokemon from 'pokemon';

import { configDotenv } from 'dotenv';
configDotenv(); //load the env file

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
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
  },
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log("secret is" + process.env.cookieSecret);
app.use(cookieParser(process.env.cookieSecret));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.cookieSecret,
}));

app.use(express.static(__dirname + '/public'));

app.use(weatherMiddleware);
app.use(flashMiddleware);

//this moved from handlers.js to here, use to avoid redeclaring all cookie and session variables.
//But once it's in req, it can be used, so handlers.js uses the username.
app.get('/', (req, res) => {
  console.log(req.session.username + " first " + req.signedCookies.signed_userid);
  if (!req.signedCookies.signed_userid ) { 
    res.cookie('signed_userid', (Math.random() * 10000).toFixed(0), {signed: true});
    console.log(" cookie is  " + req.signedCookies.signed_userid);
     //hows to reload the cookie from browser, so won't show, until next reload, I think.
  }
  //if (req.session.username == undefined) { req.session.username = pokemon.random(); }
  if (!req.session.username) req.session.username = pokemon.random(); 
  console.log(req.session.username + " first " + req.signedCookies.signed_userid);
  res.render('home', {
    userid: req.signedCookies.signed_userid,
    username: req.session.username
  });
});

app.get('/set-random-userid', (req, res) => {
  res.cookie('signed_userid', (Math.random() * 10000).toFixed(0), {signed: true});
  res.redirect('/');
});

app.get('/clear-userid', 
  (req, res) => {
    res.clearCookie('signed_userid', {signed: true});
    res.redirect('/');
});
app.get('/set-random-username', (req, res) => {
  req.session.username = pokemon.random();
  res.redirect('/');
});
app.get('/clear-username', 
  (req, res) => {
    delete req.session.username;
    res.redirect('/');
});

// handlers for browser-based form submission
app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);
app.get('/newsletter-archive', handlers.newsletterSignupThankYou);

app.use(handlers.notFound);
app.use(handlers.serverError);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.');
});

