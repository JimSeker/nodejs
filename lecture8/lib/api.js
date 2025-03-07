"use strict";
const db = require('../db');

exports.highScoreAdd = (req, res) => {
    res.render('api-add')
};

exports.highScoreDel = (req, res) => {
    res.render('api-delete')
}

;exports.highScoreUpdate = (req, res) => {
    res.render('api-update')
};

exports.highScoreAddProcess = (req, res) => {
    console.log("api add name is " + req.body.name + " score is " + req.body.score);
    const name = req.body.name || '', score = req.body.score || '';
    // input validation
    if (name == '' || score == '') {
        console.log("name " + name + " or score " + score + "invalid");
        return res.status(200).json({ error: true, message: "Invalid input" });
    }
    //add the data to database, then redirect to home page?  add page?  
    db.addData(name, score);
    return res.status(201).json({ error: false, message: name + " added" });
};

exports.highScoreGet = async (req, res) => {
    const scoredata = await db.getData();
    //finally render the page with the data, hopefully
    res.status(200).json({ error: false, data: scoredata });
}

exports.highScoreGetOne = async (req, res) => {
    const name = req.params.name;
    console.log("name is " + name);
    const scoredata = await db.getDataByName(name) ;

    if (scoredata.length > 0) {
        return res.status(200).json({error: false, data: scoredata});
    } else {
        return res.status(200).json({ error: true, message: "Name not found" });
    }
}

exports.highScoredeleteProcess = async (req, res) => {
 const name = req.params.name || '';
 console.log("name is " + name);
 // input validation
 if( name == '' ) {
   console.log("del name " + name + "invalid"); 
   return res.status(200).json({ error: true, message: "Invalid input" });
 }
 
 let ret = await db.deleteData(name);
 return res.status(200).json({ error: false, message: "number of deleted is " + ret });
};

exports.highScoreUpdateProcess = async (req, res) => {
  const name = req.params.name || '';
  const score = req.body.score || '';
  // input validation
  if( name == '' || score == '') {
    console.log("name " + name + " or score "+ socre +"invalid"); 
    return res.status(200).json({ error: true, message: "Invalid input" });
  }
  let ret = await db.updateData(name, score);
  return res.status(200).json({ error: false, message: "number of updated is "+ret });
};