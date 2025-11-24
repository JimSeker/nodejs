"use strict";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { firebaseConfig } from "./init.js";
import { getDataConnect } from "firebase/data-connect";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
let user = "";

/*
  * This function will create a known user with the email and password provided.
  * there is a createUserWithEmailAndPassword function that will create a user and log them in. not shown here.
*/
export async function login(email, password) {
  console.log("login");
  let userCredential = await signInWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {  //the then is not waiting, so use await instead.
    //   // Signed in 
    //   console.log("logged in " + userCredential.user.displayName);
    //   user = userCredential.user.displayName;
    //   if (user == null) {        user = userCredential.user.email;}
    //   console.log("logged in " + user);
    //   return user;
    // })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        console.log('Wrong password.');
      }
      console.log(errorMessage);
      return "";
    });
  if (userCredential) {
    user = userCredential.user.displayName;
    if (user == null) { user = userCredential.user.email; }
    console.log("logged in " + user);
  }
  return user;
}

//this function will log the user out.
export async function logout() {
  console.log("logout");
  await auth.signOut();
  console.log("logged out");
  user = "";
}

//this function will add data to the database.
export async function addData(first, middle, last, born) {
  console.log("setData");
  //addDoc will generate a unique ID for the document, setDoc will use the ID you provide.
  const docRef = await addDoc(collection(db, "users"), {
    first: first,
    middle: middle,
    last: last,
    born: born,
  });
  console.log("Document written with ID: ", docRef.id);
}

//returns an anrray of objects with the data from the database, if there user is logged in.
export async function getData() {
  let data = [];
  //basic error checking here.
  if (auth.currentUser == null) { console.log("no user logged in"); return data; }
  //login, so we can get data from the database.
  await getDocs(collection(db, "users")).then((querySnapshot) => { //get all the data from the collection.
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        // console.log(`${doc.id} => ${doc.data().first} ${doc.data().middle} ${doc.data().last} ${doc.data().born}`);
        data.push({ key: doc.id, first: doc.data().first, middle: doc.data().middle, last: doc.data().last, born: doc.data().born });
      });
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return data;
}

//this function will update the data in the database.
export async function updateData(key, first, middle, last, born) {
  console.log("updateData");
  const docRef = doc(db, "users", key);
  //use setDoc to update al fieds, deletes any yuou don't list.
  //use updateDoc to update only the fields you list.
  await updateDoc(docRef, {
    first: first,
    middle: middle,
    last: last,
    born: born,
  });
  console.log("Document updated with ID: ", docRef.id);
}

//this function will delete the data from the database.
export async function deleteData(key) {
  console.log("deleteData");
  // await deleteDoc(doc(db, "users", key));  //short version, but no return value.
  const docRef = doc(db, "users", key);
  await deleteDoc(docRef);
  console.log("Document deleted with ID: ", docRef.id);
}

export default { addData, getData, updateData, deleteData, login, logout };