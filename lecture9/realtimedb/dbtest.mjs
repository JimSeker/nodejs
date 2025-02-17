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
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });


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
