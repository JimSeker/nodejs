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

async function main() {

    var data = [
        ["Jim", 3012],
        ["Michael", 1000],
    ];

    let conn = await getConnection();
    if (conn) {

        //Drop Table IF Exists
        await conn.query("DROP TABLE IF EXISTS highscore");
        //Create Table
        await conn.query("create table if not exists highscore ( name varchar(100) not null unique, score INT not null)");

        //add some test data.
        await conn.batch("INSERT INTO highscore(name, score) VALUES (?, ?) ", data);

        //verifiy the data is there. 
        var rows = await conn.query("SELECT name, score FROM highscore");
        for (let i = 0, len = rows.length; i < len; i++) {
            console.log(`${rows[i].name} ${rows[i].score}`);
        }
        conn.close();
    }
}

main();
