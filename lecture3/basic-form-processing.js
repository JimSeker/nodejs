"use strict";
const express = require('express');
const { engine: expressHandlebars } = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// the following is needed to use views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// this is necessary to parse form responses
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/thanks', (req, res) => res.render('thanks'));

// see the views/home.hbs file for the contents of this view
app.get('*', (req, res) => res.render('home'));

app.post('/form-example', (req, res) => {
  console.log(`received contact from ${req.body.name} <${req.body.email}>`);
  res.redirect(303, '/thanks');
});


app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`));
