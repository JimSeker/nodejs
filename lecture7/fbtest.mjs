"use strict";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, listAll, deleteObject, getDownloadURL, getStream, getBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import axios from "axios";
import https from 'https';

import { configDotenv } from 'dotenv';
configDotenv(); //load the env file

import { firebaseConfig } from "./init.js";
import fs from 'node:fs';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const storage = getStorage(app);

let user = "";
/*
  * This function will create a known user with the email and password provided.
  * there is a createUserWithEmailAndPassword function that will create a user and log them in. not shown here.
*/
export async function login(email, password) {
    console.log("login");
    await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {  //the then is not waiting, so use await instead.
            // Signed in
            console.log("logged in " + userCredential.user.displayName);
            user = userCredential.user.displayName;
            if (user == null) { user = userCredential.user.email; }
            console.log("logged in " + user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                console.log('Wrong password.');
            }
            console.log(errorMessage);
            return "";
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

async function uploadFile(filepath, name, type) {
    // Create a reference to 'images/'
    const storageRef = ref(storage, 'images/' + name);
    const fileBuffer = fs.readFileSync(filepath)
    const metadata = { contentType: type, };
    await uploadBytes(storageRef, fileBuffer, metadata).then((snapshot) => {
        console.log('uploaded file!');
    });
}

//download a file, but not working.  don't get the data from the file.
async function downloadFile(name) {
    // Create a reference to the file we want to download
    const storageRef = ref(storage, 'images/' + name);
    // Get the download URL
    const url = await getDownloadURL(storageRef);
    console.log(url);
    //await downloadFileURL(url, name);

    //axois downloads the data for us, using https, so we don't have to.
    axios.get(url).then((response) => { 
        console.log(response.data);
        fs.writeFileSync(name, response.data);
    }
    ).catch((error) => {
        console.log(error);
    });


}


//download the data from the url provided and save it to the file name provided.
function downloadFileURL(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);

        https.get(url, response => {
            if (response.statusCode !== 200) {
                reject(`Download failed with status code ${response.statusCode}`);
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close(resolve);
            });

            file.on('error', err => {
                fs.unlink(dest, () => reject(err.message));
            });
        }).on('error', err => {
            reject(err.message);
        });
    });
}


//delete a file, works well.
async function deleteFile(name) {
    // Create a reference to the file to delete
    const storageRef = ref(storage, 'images/' + name);
    // Delete the file
    await deleteObject(storageRef).catch((error) => {
        console.log(error);
    });
    console.log('Deleted');
}


//find all the files in the images folder
async function listFiles() {
    // Create a reference under which you want to list
    const listRef = ref(storage, 'images/');

    // Find all the prefixes and items.
    //if list is really lone, it should use list, which do not return all the items at once, 
    //but rather a page at a time.  This is better for large lists.
    await listAll(listRef)
        .then((res) => {
            console.log("inside list files");
            //if there are folders, which my example doesn't have.
            res.prefixes.forEach((folderRef) => {
                // All the prefixes under listRef.
                // You may call listAll() recursively on them.
            });
            res.items.forEach(async (itemRef) => {
                // All the items under listRef, just print the url for it each item.
                console.log(itemRef.name, itemRef.fullPath);
                const url = await getDownloadURL(itemRef);
                console.log(url);
            });
        }).catch((error) => {

            console.log(error);
        });
}



async function main() {
   await login(process.env.FB_EMAIL, process.env.FB_PASSWORD);

    await uploadFile("img/B.png", "B.png", "image/png");
   // await uploadFile("img/C.jpg", "C.jpg", "image/jpg");
 
    await listFiles();
    await downloadFile("B.png");
   // await deleteFile("B.png");  
    await logout();
}

main();
