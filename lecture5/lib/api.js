"use strict";
import db from '../db.js';

export const highScoreAddProcess = (req, res) => {
    console.log("api add name is " + req.body.name + " score is " + req.body.score);
    const name = req.body.name || '', score = req.body.score || '';
    // input validation
    if (name == '' || score == '') {
        console.log("name " + name + " or score " + score + "invalid");
        return res.status(200).json({ error: true, message: "Invalid input" });
    }
    //add the data to database, then redirect to home page?  add page?  
    db.addData(name, score);
    return res.status(201).json({ error: false, message: id + " " + name + " added" });
};

export const highScoreGet = async (req, res) => {
    const scoredata = await db.getData();
    //finally render the page with the data, hopefully
    res.status(200).json({ error: false, data: scoredata });
}

export const highScoreGetOne = async (req, res) => {
    const name = req.params.name || '';

    if (name == '') {
        console.log("name is " + name);
        return res.status(200).json({ error: true, message: "Invalid input" });
    }
    const scoredata = await db.getDataByName(name);

    if (scoredata.length > 0) {
        return res.status(200).json({ error: false, data: scoredata });
    } else {
        return res.status(200).json({ error: true, message: "Name not found" });
    }
}

export const highScoredeleteProcess = async (req, res) => {
    const id = req.params.id || '';
    console.log("id is " + id);
    // input validation
    if (id == '') {
        console.log("del id " + id + "invalid");
        return res.status(200).json({ error: true, message: "Invalid input" });
    }

    let ret = await db.deleteData(id);
    return res.status(200).json({ error: false, message: "number of deleted is " + ret });
};

export const highScoreUpdateProcess = async (req, res) => {
    const id = req.params.id || '';
    const name = req.body.name || '';
    const score = req.body.score || '';
    // input validation
    if (id == "" || name == '' || score == '') {
        console.log("id " + id + " name " + name + " or score " + score + " is invalid");
        return res.status(200).json({ error: true, message: "Invalid input" });
    }
    let ret = await db.updateData(id, name, score);
    return res.status(200).json({ error: false, message: "number of updated is " + ret });
};

export default {
    highScoreAddProcess,
    highScoreGet,
    highScoreGetOne,
    highScoredeleteProcess,
    highScoreUpdateProcess
};