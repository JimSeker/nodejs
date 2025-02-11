"use strict";
const mariadb = require("mariadb");
require("dotenv").config();

async function getConnection() {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: process.env.MDB_HOST,
            port: process.env.MDB_PORT,
            user: process.env.MDB_USER,
            password: process.env.MDB_PASS,
            database: "cosc4735",
        });
    } catch (err) {
        console.log("SQL error in establishing a connection: ", err);
        conn = null;
    } finally {
        // Close Connection
        return conn;
    };
};
function closeConnection(conn) {
    if (conn) conn.close();
}

//Get list of contacts
//add function with helper function that main code calls.
function add_data(conn, data) {
    return conn.batch("INSERT INTO highscore(name, score) VALUES (?, ?) ", data);
}
//open db, add the data, then close it.
async function addData (name, number)  {
    var score = [name, number];
    let conn = await getConnection();
    if (conn) {
        await add_data(conn, score);
        closeConnection(conn);
    }
};


//helper query function for display
function get_data(conn) {
    return conn.query("SELECT name, score FROM highscore");
}
//get the data function opens the db, gets the data, then closes the db.
async function getData ()  {
    let conn = await getConnection();
    if (conn) {
        const rows = await get_data(conn);
        closeConnection(conn);
        return rows;
    } else {
        return;
    }
};

//helper query function for display
function get_data_byName(conn, name) {
    return conn.query("SELECT name, score FROM highscore where name = ?", name);
}
//get the data function opens the db, gets the data, then closes the db.
async function getDataByName (name)  {
    let conn = await getConnection();
    if (conn) {
        const rows = await get_data_byName(conn, name);
        closeConnection(conn);
        return rows;
    } else {
        return;
    }
};

//helper funciton to update code
async function update_data(conn, data) {
    return conn.query("UPDATE highscore SET score = ? WHERE name = ?", data)
}

//actual update database code. 
async function updateData (name, number)  {
    var score = [number, name];  //yes, it's reversed, from add, because order it's used.
    let conn = await getConnection();
    if (conn) {
       let ret =  await update_data(conn, score);
        closeConnection(conn);
        return ret.affectedRows;
    }
};

//delete helper code
function del_data(conn, data) {
    return conn.query("DELETE FROM highscore where name = ?", data);
}
//actual delete database code.
async function deleteData (name)  {
    var value = [name];  //yes, needs to be in an array.
    let conn = await getConnection();
    if (conn) {
        let ret = await del_data(conn, value);
        closeConnection(conn);
        return ret.affectedRows;
    }
};

//only 4 funcitons are exported and can be used by the handler.js or index.js code.
module.exports = {getData, addData, updateData, deleteData, getDataByName};