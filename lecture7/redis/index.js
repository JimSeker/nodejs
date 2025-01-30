"use strict";
const express = require('express');
const expressHandlebars = require('express-handlebars').engine;
const bodyParser = require('body-parser');
require("dotenv").config()

const handlers = require('./lib/handlers');
const cookieParser = require('cookie-parser');
const pokemon = require('pokemon');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
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
  console.log("username is " + username);
  //if it doesn't exist, set one.
  if (username == "") {
    username = pokemon.random();
    res.cookie('username', username);
    console.log("new username chosen" + username);
  }
  const scoredata =  await db.getData(username);
  // console.log(typeof scoredata);
  // console.log(" is it array "+ Array.isArray(scoredata));
  const context = {
    username: username,
    scoreinfo: scoredata.map (
      row => {
        console.log("name is " + row);
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

app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.');
});

