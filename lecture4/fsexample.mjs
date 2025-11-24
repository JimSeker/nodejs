"use strict";
//const fs = require('fs');
import fs from 'fs';

let data = "hello world\n";
let appenddata = "next line\n";

//write example
fs.writeFile('fs.txt', data, (err) => {
    if (err)
        console.log("fs write failed.");
    else 
        console.log('fs.txt created.');
});

//append example
fs.appendFile('fs.txt', appenddata, (err) => {
    if (err)
        console.log("append failed");
    else
        console.log('appended to fs.txt');
});

//finally read the file.  added 'utf-8', because it
//printing bytes, instead of the text.
fs.readFile('fs.txt', 'utf-8', (err, data) => {
    if (err) console.log("Read failed.");
    else 
      console.log(data);
});