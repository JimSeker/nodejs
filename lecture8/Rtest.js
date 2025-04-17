"use strict";

//file used to test rest.

const axios = require('axios');


//to test added.
async function main() {
await axios.post('http://localhost:3000/api/scores', {
    name: 'test4',
    score: '100'
})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error);
    });


await axios.get('http://localhost:3000/api/scores').then(function (response) {    
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});



await axios.get('http://localhost:3000/api/scores/test').then(function (response) {
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
}); 



await axios.put('http://localhost:3000/api/scores/test4', {
    score: '200'
}).then(function (response) {
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

await axios.get('http://localhost:3000/api/scores').then(function (response) {    
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

await axios.delete('http://localhost:3000/api/scores/test4').then(function (response) {
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

await axios.get('http://localhost:3000/api/scores').then(function (response) {    
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});



}

main();