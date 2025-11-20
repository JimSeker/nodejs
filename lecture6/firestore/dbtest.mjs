"use strict";
// import { getDatabase, ref, onValue, off } from "firebase/database";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot  } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { firebaseConfig } from "./init.js";
import { getDataConnect } from "firebase/data-connect";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);





let email = "cosc4735@uwyo.edu";
let password = "123456";

async function getData() {
  const querySnapshot =  await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().first} ${doc.data().middle} ${doc.data().last} ${doc.data().born}`);
  });
}

async function setData() {
  console.log("setData");
  //addDoc will generate a unique ID for the document, setDoc will use the ID you provide.
  const docRef = await addDoc(collection(db, "users"), {
    first: "Micheal",
    middle: "R",
    last: "Stoll",
    born: 1462
  });
  console.log("Document written with ID: ", docRef.id);
}

async function updateData() {
  console.log("updateData");
  const docRef = doc(db, "users", "ER8WyUJhrWx6Kjm1KLHu");
  //use setDoc to update al fieds, deletes any yuou don't list.
  //use updateDoc to update only the fields you list.
  await updateDoc(docRef, {
    //first: "Micheal",
    middle: "J",
    //last: "Stoll",
    born: 1492,
  });
  console.log("Document updated with ID: ", docRef.id);
}

async function listenData() {
  console.log("listenData");
  const docRef = doc(db, "users", "ER8WyUJhrWx6Kjm1KLHu");
  const unsub = onSnapshot(docRef, (doc) => {
    console.log("Current data: ", doc.data());
  }, (error) => {
    console.log("Encountered error: ", error);      
  });
  //unsub();  //turns off the listener.
}

async function deleteData() {
  console.log("deleteData");
  const docRef = doc(db, "users", "BSIq9j6Iz6jCcKxyijpE");
  await deleteDoc(docRef);
  console.log("Document deleted with ID: ", docRef.id);
}


signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    console.log("logged in");
    const user = userCredential.user;
    //setData();
    updateData();
    getData();
    //deleteData();
    listenData();
  })
    //starCountRef.off();  //turns off the listener.  
  .catch ((error) => {
  const errorCode = error.code;
  const errorMessage = error.message;
  console.log(errorMessage);
});



/*
// This code is the basic listener code from firebase docs, but makes no sense to use in a web server.  Test code only.
// This would be better in a client side app.

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

*/
console.log("done");
