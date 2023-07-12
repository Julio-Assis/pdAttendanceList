// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmZ7S50suvVLpG3X3HFeAk9R987p79PmY",
  authDomain: "pd-sign-up-form.firebaseapp.com",
  databaseURL: "https://pd-sign-up-form-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pd-sign-up-form",
  storageBucket: "pd-sign-up-form.appspot.com",
  messagingSenderId: "358112917111",
  appId: "1:358112917111:web:ed7c84b8bf58fa3de67872",
  measurementId: "G-TY4GXTGGQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export {app as FirebaseApp, db}
