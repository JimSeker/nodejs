"use strict";
import db from '../db.js';

export const scoreAdd = (req, res) => {
  res.render('score-add', { username: req.cookies.username })
};

export const scoreAddProcess = (req, res) => {
  const name = req.body.name || '', score = req.body.score || '';
  // input validation
  if (name == '' || score == '') {
    console.log("name " + name + " or score " + score + "invalid");
    return res.redirect(303, '/highscore-add');
  }
  //add the data to database, then redirect to home page?  add page?  
  db.addData(name, score);
  return res.redirect(303, '/')
};

export const scoreOther = async (req, res) => {

  const keys = await db.getAllListKeys();
  //console.log(keys);
  //create the context variable with correct obj names hopefully.
  var arrScores = [];
  var listprom = keys.map(key => {
    return db.getData(key);
  });

  await Promise.all(listprom).then((scores) => {
    //this is terrible for display, but need a list for the example.
    for (let i = 0; i < scores.length; i++) {
      arrScores.push(keys[i] + ": " + scores[i]);
    }
  });
  //this finally builds the data structure to render.
  const context = {
    scoreinfo: arrScores.map(
      (row) => {
        return { name: row, }
      }
    )
  };
  console.log(context);
  //finally render the page with the data, hopefully
  res.render('score-others', context);
};


export const scoreDelete = async (req, res) => {

  const username = req.cookies.username;
  if (username != "") {
    const scoredata = await db.deleteData(username);
  }
  //create the context variable with correct obj names hopefully.
  return res.redirect(303, '/')
};


export const notFound = (req, res) => res.render('404');

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
export const serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */

export default { scoreAdd, scoreAddProcess, scoreDelete, scoreOther, notFound, serverError };