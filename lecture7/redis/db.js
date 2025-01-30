var redis = require('redis');




async function getData(key) {
    const client = redis.createClient();

    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });

    const exists = await client.exists(key);
    var mylist;
    if (exists) {
        console.log("key exists? " + key);
        mylist = await client.lRange(key, 0, -1);
        console.log(key + " return value is " + mylist);
    } else {
        console.log("key doesn't exist " + key);
        mylist = [];
    }
    client.disconnect();
    return mylist;
}

async function addData(key, score) {
    const client = redis.createClient();
    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });
    //  console.log("add here "+key+ " " + score);
    await client.rPush(key, score);
    //    console.log("add added ?");
    // var mylist = await client.lRange(key, 0, -1);
    // console.log("checking list.");
    client.disconnect();
}

async function deleteData(key) {
    const client = redis.createClient();

    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });
    console.log("key is " + key);
    const exists = await client.exists(key);
    if (exists) {
        const val = await client.lPop(key);
        console.log(key + " return value is " + val);
    }
    client.disconnect();
}

async function getAllListKeys() {
    const client = redis.createClient();
    client.connect();
    client.on('error', err => { console.log('Redis Client Error', err); return; });

    const allKeys = await client.keys('*');
    console.log(allKeys);
 
    var listprom = allKeys.map( key => {
        return client.type(key);
      }
    );
    console.log(listprom);

    var listKeys = [];
    console.log("before promise\n");
   await Promise.all(listprom).then( (keytype) => {
        console.log(keytype);
       for (let i=0; i < keytype.length; i++) {
         if (keytype[i] == 'list') listKeys.push(allKeys[i]);
       }
    });
    console.log("after promise\n");
    console.log(listKeys);
    return listKeys;
}


//only 4 funcitons are exported and can be used by the handler.js or index.js code.
module.exports = { getData, addData, deleteData, getAllListKeys };



