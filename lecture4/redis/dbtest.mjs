import redis from 'redis';

const client = redis.createClient();

client.connect();

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Redis has connected'));

let key = "myList1";
let key2 = "mylist2";
let data = "value1";
let data2 = "value2";
let data3 = "value3";



async function main() {
  await client.set(key, data);
  var rdata = await client.get(key);
  console.log(key + " return value is " + rdata);

  //expire (ie it will be deleted) in 30 seconds.
  await client.expire(key, 30);

  //delete key2 and data, for reuse of key2
  await client.del(key2);
  await client.del('');

  var type = await client.type(key);
  console.log(`The type of key '${key}' is: ${type}`);

  //list based keys.
  console.log("\nlists data");
  await client.rPush(key2, data);
  await client.rPush(key2, data2);
  await client.rPush(key2, data3);

  rdata = await client.lPop(key2);
  console.log(" return value is " + rdata);

  //gets all the members of a list, using a range.
  var mylist = await client.lRange(key2, 0, -1);
  console.log(key2 + " return value is " + mylist);

  rdata = await client.rPop(key2);
  console.log(" return value is " + rdata);
  //gets all the members of a list, using a range.
  mylist = await client.lRange(key2, 0, -1);
  console.log(key2 + " return value is " + mylist);

  var type = await client.type(key2);
  console.log(`The type of key '${key2}' is: ${type}`);


  //delete key2 and data
  await client.del(key2);
  const exists = await client.exists(key2);
  if (!exists) {
    console.log(key2 + " has been deleted");
  }

  console.log("\nsets data");
  //sets  (for sorted set or priorityqueue use zAdd, zRange), 
  // data must be unique as well, so second is ignored.
  await client.sAdd(key2, ['red', 'green', 'blue', 'purple', 'red'])
  var myset = await client.sMembers(key2);
  console.log(key2 + " return value is " + myset);
  await client.sRem(key2, 'purple');
  myset = await client.sMembers(key2);
  console.log(key2 + " after sRem purple is " + myset);


  var type = await client.type(key2);
  console.log(`The type of key '${key2}' is: ${type}`);


  // Demonstrating Hash operations
  console.log("\nHash Operations");
  await client.hSet('user:1000', { name: 'Alice', email: 'alice@example.com', age: 25 });
  let user = await client.hGetAll('user:1000');
  console.log('User 1000:', user);
  await client.hDel('user:1000', 'age');
  user = await client.hGetAll('user:1000');
  console.log('User 1000 after HDEL:', user);


  try {
    const type = await client.type(key2);
    console.log(`The type of key '${key}' is: ${type}`);
  } catch (error) {
    console.error('Error checking key type:', error);
  }

  var type = await client.type('user:1000');
  console.log(`The type of key user:1000 is: ${type}`);


  client.disconnect();
};

main();

