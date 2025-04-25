"use strict";
// the package.json file sets "type": "module" to use ES modules.  so .jms file extensions
// are not required.
import { configDotenv } from 'dotenv';
configDotenv(); //load the env file
//const express = require('express');
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

//main page
app.get('/', (req, res) => {
    res.type('text/plain');
    res.send('Advanced Mobile');
});

//about page
app.get('/about*', (req, res) => {
    res.type('text/plain');
    res.send('About Advanced Mobile');
});

// custom 404 page
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`));