"use strict";
import{ default as db } from '../db.mjs';

export const dbAdd = (req, res) => {
  res.render('db-add', {} )
};

export const dbAddProcess = (req, res) => {
  const first = req.body.first || '', middle = req.body.middle || '';
  const last = req.body.last || '', born = req.body.born || '';
  // input validation
  if( first == '' || middle == '' || last == '' || born == '') {
    console.log("first " + first + " or " + middle + " or " + last + " or " + born + "invalid");
    return res.redirect(303, '/db-add');
  }
  //add the data to database, 
  db.addData(first, middle, last, born);
  return res.redirect(303, '/')
};

export const dbUpdate = async (req, res) => {
   const data =  await db.getData();
   //create the context variable with correct obj names hopefully.
   const context = { listscores:  data};
   //finally render the page with the data, hopefully
   res.render('db-update', context);
};

export const dbUpdateProcess = async (req, res) => {
  const key = req.body.key || '', first = req.body.first || '', middle = req.body.middle || '';
  const last = req.body.last || '', born = req.body.born || '';
  // input validation
  if( key == '' ||first == '' || middle == '' || last == '' || born == '') {
    console.log("key " + key + " or " + first + " or " + middle + " or " + last + " or " + born + "invalid");
    return res.redirect(303, '/db-update');
  }
  //add the data to database, then redirect to home page?  add page?  
  await db.updateData(key, first, middle, last, born);   
  return res.redirect(303, '/')
};

export const dbDelete = async (req, res) => {
  const data =  await db.getData();
  //create the context variable with correct obj names hopefully.
  const context = { listscores:  data};
  //finally render the page with the data, hopefully
  res.render('db-del', context);
};

export const dbDeleteProcess = async (req, res) => {
 const key = req.body.key;
 // input validation
 if( key == '' ) {
   console.log("key " + name + "invalid"); 
   return res.redirect(303, '/db-del');
 }
 //add the data to database, then redirect to home page?  add page?  
 await db.deleteData(key);
 return res.redirect(303, '/')
};


export const notFound = (req, res) => res.render('404');

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
export const  serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */

export default { notFound, serverError, dbAdd, dbAddProcess, dbUpdate, dbUpdateProcess, dbDelete, dbDeleteProcess };