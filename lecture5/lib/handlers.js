"use strict";
import db from '../db.js';

// handlers for browser-based form submission
export const highScoreAdd = (req, res) => {
  res.render('highscore-add', {} )
};

export const highScoreAddProcess = (req, res) => {
  const name = req.body.name || '', score = req.body.score || '';
  // input validation
  if( name == '' && score == '') {
    console.log("name " + name + " or score "+ socre +"invalid"); 
    return res.redirect(303, '/highscore-add');
  }
  //add the data to database, then redirect to home page?  add page?  
  db.addData(name, score);
  return res.redirect(303, '/')
};

export const highScoreUpdate = async (req, res) => {
   const scoredata =  await db.getData();
   //create the context variable with correct obj names hopefully.
   const context = { listscores:  scoredata.map (
      row => {
        console.log("name is " + row.name);
        return { 
          id: row.id,
          name: row.name,
          score: row.score,
        }
      }   
   )};
   //finally render the page with the data, hopefully
   res.render('highscore-update', context);
};

export const highScoreUpdateProcess = async (req, res) => {
  const id = req.body.id || '';
  const name = req.body.name || '', score = req.body.score || '';
  // input validation
  if( id == '' || name == '' || score == '') {
    console.log("id " + id +" name " + name + " or score "+ score +"invalid"); 
    return res.redirect(303, '/highscore-update');
  }
  //add the data to database, then redirect to home page?  add page?  
  await db.updateData(id, name, score);
  return res.redirect(303, '/')
};

export const highScoredelete = async (req, res) => {
  const scoredata =  await db.getData();
  //create the context variable with correct obj names hopefully.
  const context = { listscores:  scoredata.map (
     row => {
       console.log("name is " + row.name);
       return { 
        id: row.id,
         name: row.name,
         score: row.score,
       }
     }   
  )};
  //finally render the page with the data, hopefully
  res.render('highscore-del', context);
};

export const highScoredeleteProcess = async (req, res) => {
 const id = req.body.id || '';
 // input validation
 if( id == '' ) {
   console.log("id  " + id + "invalid"); 
   return res.redirect(303, '/highscore-del');
 }
 //add the data to database, then redirect to home page?  add page?  
 await db.deleteData(id);
 return res.redirect(303, '/')
};


export const notFound = (req, res) => res.render('404');

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
export const serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */

export default {
  highScoreAdd,
  highScoreAddProcess,
  highScoreUpdate,
  highScoreUpdateProcess,
  highScoredelete,
  highScoredeleteProcess,
  notFound,
  serverError
};