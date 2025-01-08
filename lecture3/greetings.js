"use strict";
const express = require('express');
const { engine: expressHandlebars } = require('express-handlebars');

const cookieParser = require('cookie-parser');
const session = require('express-session');
const pokemon = require('pokemon');
const app = express();
const port = process.env.PORT || 3000;

// the following is needed to use views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
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

app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/greeting\n`));
