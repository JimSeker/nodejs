"use strict";
const express = require('express');
const expressHandlebars = require('express-handlebars').engine;
const bodyParser = require('body-parser');
require("dotenv").config()

const handlers = require('./lib/handlers');
const db = require('./db');


const app = express();
const port = process.env.PORT || 3000;

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'  }));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//most of this could be in the hanlders.js, but here just to show it. 
app.get('/', async (req, res) => {
   const scoredata =  await db.getData();
   //create the context variable with correct obj names hopefully.
   const context = { listscores:  scoredata.map (
      row => {
        console.log("name is " + row.name);
        return { 
          name: row.name,
          score: row.score,
        }
      }   
   )};
   console.log(context);
   //finally render the page with the data, hopefully
   res.render('home', context);

});

// handlers for browser-based form submission
app.get('/highscore-add', handlers.highScoreAdd)
app.post('/highscore-add/process', handlers.highScoreAddProcess);
app.get('/highscore-update', handlers.highScoreUpdate)
app.post('/highscore-update/process', handlers.highScoreUpdateProcess);
app.get('/highscore-del', handlers.highScoredelete)
app.post('/highscore-del/process', handlers.highScoredeleteProcess);

app.use(handlers.notFound);
app.use(handlers.serverError);

app.listen(port, () => {
  console.log(`Express started on http://localhost:${port}` +
    '; press Ctrl-C to terminate.');
});

