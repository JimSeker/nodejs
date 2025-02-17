
import { getDatabase, ref, onValue, off } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import "./init.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const auth = getAuth();

let email = "cosc4735@uwyo.edu";
let password = "123456";

await signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    console.log("logged in");
    const user = userCredential.user;
    const starCountRef = ref(db, 'messages/');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      return;
    }  , {onlyOnce: true}  //only once, then turn off the listener.   or use the off below when you are done with the listener.
    );
    //off(starCountRef);  //turns off the listener.  
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

export default db;