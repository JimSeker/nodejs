"use strict";
const mariadb = require("mariadb");
require("dotenv").config();

async function getConnection () {
    let conn;
    try {
        conn = await mariadb.createConnection({
            host: process.env.MDB_HOST,
            port: process.env.MDB_PORT,
            user: process.env.MDB_USER,
            password: process.env.MDB_PASS,
            database: "cosc4735",
        });
        // var rows = await conn.query("SELECT name, score FROM highscore");
        // for (let i = 0, len = rows.length; i < len; i++) {
        //     console.log(`${rows[i].name} ${rows[i].score}`);
        //  }
    } catch (err) {
        console.log("SQL error in establishing a connection: ", err);
        conn = null;
    } finally {
        // Close Connection
        return conn;
    };
};

function closeConnection( conn) {
    if (conn) conn.close();
}

//Get list of contacts
function get_data(conn) {
    return conn.query("SELECT name, score FROM highscore");
 }


async function main() {
    let conn;
    
    conn = await getConnection();
    if (conn) {  //connection worked
    
        var rows = await get_data(conn);
       // var rows = await conn.query("SELECT name, score FROM highscore");
        for (let i = 0, len = rows.length; i < len; i++) {
            console.log(`${rows[i].name} ${rows[i].score}`);
         }
       closeConnection(conn);
    }
}

main();