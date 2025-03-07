"use strict";
// import { getDatabase, ref, onValue, off } from "firebase/database";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot  } from "firebase/firestore";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";

import { firebaseConfig } from "./init.js";
import { getDataConnect } from "firebase/data-connect";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//test if do a google authenciation.
var id_token = googleUser.getAuthResponse().id_token

// Build Firebase credential with the Google ID token.
const credential = GoogleAuthProvider.credential(id_token);

// Sign in with credential from the Google user.
signInWithCredential(auth, credential).catch((error) => {
  // Handle Errors here.
  const errorCode = error.code;
  const errorMessage = error.message;
  // The email of the user's account used.
  const email = error.customData.email;
  // The AuthCredential type that was used.
  const credential = GoogleAuthProvider.credentialFromError(error);
  // ...
});
console.log("logged in " + credential.user.displayName);
