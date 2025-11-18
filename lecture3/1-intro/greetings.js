"use strict";
import express from 'express';
import { engine } from 'express-handlebars';
import { default as bodyParser } from 'body-parser';
//const expressSession = require('express-session');
import { default as session } from 'express-session';

//const cookieParser = require('cookie-parser');
import { default as cookieParser } from 'cookie-parser';
//const pokemon = require('pokemon');
import { default as pokemon } from 'pokemon';

import { configDotenv } from 'dotenv';
configDotenv(); //load the env file

const app = express();


// the following is needed to use views
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// the following is needed for cookie support
app.use(cookieParser());

// the following is needed for session support
app.use(session({ resave: false, saveUninitialized: false, secret: 'keyboard cat' }));

// see the views/greeting.hbs file for the contents of this view
app.get('/greeting', (req, res) => {
  res.render('greeting', {
    message: 'Hello Adv Mobile Programmer!',
    style: req.query.style,
    userid: req.cookies.userid,
    username: req.session.username
  });
});

app.get('/set-random-userid', (req, res) => {
  res.cookie('userid', (Math.random()*10000).toFixed(0));
  res.redirect('/greeting');
});

app.get('/set-random-username', (req, res) => {
  req.session.username = pokemon.random();
  res.redirect('/greeting');
});

app.get('*', (req, res) => res.send('Check out our <a href="/greeting">greeting</a> page!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/greeting\n`));
