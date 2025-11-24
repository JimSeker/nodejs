"use strict";
// import { getDatabase, ref, onValue, off } from "firebase/database";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";

import { firebaseConfig } from "./init.js";

// Initialize Firebase
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


const auth = firebase.auth();

let email = "cosc4735@uwyo.edu";
let password = "123456";

firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    console.log("logged in");
    const user = userCredential.user;
    const starCountRef = firebase.database().ref( 'messages/');
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val();
     console.log(data);
    });
    //starCountRef.off();  //turns off the listener.  

    //simple data test
    firebase.database().ref('/simple').set({
      simple: "hello, world, js",
      second: "second value"
    });
    firebase.database().ref('/simple').on('value', (snapshot) => {
      const data = snapshot.val();
      //data.simple  and data.second have the data.
      console.log(data);
    });

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });


 
//This is the basic listener code from firebase docs, but makes no sense to use in a web server.  Test code only.
//This would be better in a client side app.

// const starCountRef = ref(db, 'messages/');
// onValue(starCountRef, (snapshot) => {
//   const data = snapshot.val();
//   console.log(data);
// });


// return onValue(ref(db, '/messages/'), (snapshot) => {
//     const data = snapshot.val();
//     console.log(data);
//     return;
// }, {
//   onlyOnce: false
// });


console.log("done");
