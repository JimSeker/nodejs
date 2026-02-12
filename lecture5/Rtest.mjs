"use strict";

//file used to test rest.
import axios from 'axios';

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

    //get all the scores
    await axios.get('http://localhost:3000/api/scores').then(function (response) {
        console.log(response.data);
    }
    ).catch(function (error) {
        console.log(error);
    });


    //get all the scores for users named test
    await axios.get('http://localhost:3000/api/scores/test4').then(function (response) {
        console.log(response.data);
    }
    ).catch(function (error) {
        console.log(error);
    });

    //id is number for the test4 or other test data you have.  but you will need 
    //to check for the id.  looking at the current data, id would the next number assuming
    //you are using top add.
    let id = 36;

    //now update test4 from 100 to 200.
    await axios.put('http://localhost:3000/api/scores/' + id, {
        name: 'test4',
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

    //delete the test4 score
    await axios.delete('http://localhost:3000/api/scores/'+id).then(function (response) {
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

main().then(() => {
    console.log("done");
   // r1.close();
}
).catch((err) => {
    console.log(err);
    //r1.close();
});