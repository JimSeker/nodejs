"use strict";
import mariadb from "mariadb";
import { configDotenv } from 'dotenv';
configDotenv(); //load the env file

async function getConnection() {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: process.env.MDB_HOST,
            port: process.env.MDB_PORT,
            user: process.env.MDB_USER,
            password: process.env.MDB_PASS,
            database: process.env.MDB_DB,
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
function get_data(conn) {
    return conn.query("SELECT name, score FROM highscore");
}

function add_data(conn, data) {
    return conn.batch("INSERT INTO highscore(name, score) VALUES (?, ?) ", data);
}



// async function main() {
//     let conn;
//     var score = ["fred", 2000];

//     conn = await getConnection();
//     if (conn) {  //connection worked
//         await add_data(conn, score);
//         var rows = await get_data(conn);
//         // var rows = await conn.query("SELECT name, score FROM highscore");
//         for (let i = 0, len = rows.length; i < len; i++) {
//             console.log(`${rows[i].name} ${rows[i].score}`);
//         }
//         closeConnection(conn);
//     }
// }

function del_data(conn, data) {
    return conn.query("DELETE FROM highscore where name = ?", data);
}

async function update_data(conn, data) {
    return conn.query("UPDATE highscore SET score = ? WHERE name = ?", data)
}
async function main2() {
    let conn;
    var score = [2006, "fred"];
    var delscore = ["a"];

    conn = await getConnection();
    if (conn) {
        await update_data(conn, score);
        await del_data(conn, delscore);
        var rows = await get_data(conn);
        // var rows = await conn.query("SELECT name, score FROM highscore");
        for (let i = 0, len = rows.length; i < len; i++) {
            console.log(`${rows[i].name} ${rows[i].score}`);
        }
        closeConnection(conn);
    }
}

main2();