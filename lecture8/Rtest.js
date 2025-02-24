"use strict";

//file used to test rest.

const axios = require('axios');
const mariadb = require("mariadb");

//to test added.

axios.post('http://localhost:3000/api/scores', {
    name: 'test',
    score: '100'
})
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        //console.log(error);
    });


axios.get('http://localhost:3000/api/scores').then(function (response) {    
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

axios.get('http://localhost:3000/api/scores/test').then(function (response) {
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
}); 

axios.put('http://localhost:3000/api/scores/test', {
    score: '200'
}).then(function (response) {
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

axios.get('http://localhost:3000/api/scores').then(function (response) {    
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

axios.delete('http://localhost:3000/api/scores/test').then(function (response) {
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});

axios.get('http://localhost:3000/api/scores').then(function (response) {    
    console.log(response.data);
}
).catch(function (error) {
    console.log(error);
});
