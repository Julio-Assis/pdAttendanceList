"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.FirebaseApp = void 0;
// Import the functions you need from the SDKs you need
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
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
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.FirebaseApp = app;
const db = (0, firestore_1.getFirestore)(app);
exports.db = db;
