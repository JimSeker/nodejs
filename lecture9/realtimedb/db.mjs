"use strict";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";

import { firebaseConfig } from "./init.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

//should set via a session value and sent to it.  this is temp.
let email = "cosc4735@uwyo.edu";
let password = "123456";

let user = "";


// firebase.auth().signInWithEmailAndPassword(email, password)
//   .then((userCredential) => {
//     // Signed in 
//     console.log("logged in");
//     user = userCredential.user;
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     console.log(errorMessage);
//   });

/*
  * This function will create a known user with the email and password provided.
  * there is a createUserWithEmailAndPassword function that will create a user and log them in. not shown here.
*/
export async function login(email, password) {
  console.log("login");
  await firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    console.log("logged in");
    
    user = userCredential.user.displayName;
    if (user == null) { user = userCredential.user.email; }
    console.log("logged in " + user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
  return user;
}  
//this function will log the user out.
export async function logout() {
  console.log("logout");
  await auth.signOut();
  console.log("logged out");
  user = "";
}


export async function addData(title, note) {
  firebase.database().ref('messages/').push()  //added to a list, so this creats auto-generated key.
  .set({  //add set the data.
    title: title,
    note: note,
  });
}

export async function getDataListener() {
  let starCountRef = firebase.database().ref('messages/');
  starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    return data;
  });
  //starCountRef.off();  //turns off the listener.  
}

export async function getData() {
  let data = [];
  if (user == "") { return data; }  //if not logged in, return empty data.

  await firebase.database().ref('messages/').get().then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        data.push({ key: child.key, title: child.val().title, note: child.val().note });
        //console.log(child.key + " " + child.val().note + " " + child.val().title);
      });
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return data;
}


export async function updateData(key, title, note) {
  // firebase.database().ref('messages/' + key).set({
  //   title: title,
  //   note: note,
  // });
  // or use the update method to update only the title or note.
   await firebase.database().ref('messages/' + key).update({  title: title, note: note, });

}

export async function deleteData(key) {
  await firebase.database().ref('messages/' + key).remove();
}

export default { addData, getDataListener, getData, updateData, deleteData, login, logout };