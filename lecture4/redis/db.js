"use strict";

import redis from 'redis';

//this funciton reutnrs an array of data (ie the list) from the key.
export async function getData(key) {
    const client = redis.createClient();

    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });

    if (key == null) {
        console.log("key is null");
        return [];
    }

    //if the key exists, then return data, else return empty array.
    const exists = await client.exists(key);
    var mylist;
    if (exists) {
        //console.log("key exists? " + key);
        mylist = await client.lRange(key, 0, -1);
        // console.log(key + " return value is " + mylist);
    } else {
        console.log("key doesn't exist " + key);
        mylist = [];
    }
    client.disconnect();
    return mylist;
}

// Function takes a key and score and adds the score to the key as a list.
export async function addData(key, score) {
    const client = redis.createClient();
    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });

    //if the key exists, verify the key is a list key, if not, delete the key
    const exists = await client.exists(key);
    if (exists) {
        const keytype = await client.type(key);
        //console.log("key type is " + keytype);
        if (keytype != 'list') {
            //key exist, but is not a list, delete it.
            await client.del(key);
        }
    }
    //now add the data to the key.
    await client.rPush(key, score);
    client.disconnect();
}

//funcitron removes the first item from the list.  it doesn't actually delete the key.
export async function deleteData(key) {
    const client = redis.createClient();

    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });
    //console.log("key is " + key);
    //if the key exists, left pop from the list.
    const exists = await client.exists(key);
    if (exists) {
        const val = await client.lPop(key);
        //console.log(key + " return value is " + val);
    }
    client.disconnect();
}

//returns a list of all keys that are of type list.
export async function getAllListKeys() {
    const client = redis.createClient();
    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });

    //first get all the keys.  likely we use prefix for keys, like 'list-*' so this would be much simplier.
    const allKeys = await client.keys('*');
    //console.log(allKeys);
    //now check their types.  looping in js doesn't seem work with await for some reason
    //so doing this hard way.  this is no await in this loop, handled farther down.
    var listprom = allKeys.map(key => { return client.type(key); });

    var listKeys = [];
    //since await wasn't working above, use promise.all and await to get all the key types.
    await Promise.all(listprom).then((keytype) => {
        //if the key type is list, add to the array to return back.
        for (let i = 0; i < keytype.length; i++) {
            if (keytype[i] == 'list') listKeys.push(allKeys[i]);
        }
    });
    //console.log(listKeys);
    return listKeys;
}


//only 4 funcitons are exported and can be used by the handler.js or index.js code.
export default { getData, addData, deleteData, getAllListKeys };



