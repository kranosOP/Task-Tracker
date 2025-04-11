// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCDjEbF8fTr2XNLcGnNXT-rjx_A_ygSEA0",
    authDomain: "tasktracker-9cf7f.firebaseapp.com",
    projectId: "tasktracker-9cf7f",
    storageBucket: "tasktracker-9cf7f.firebasestorage.app",
    messagingSenderId: "22624068034",
    appId: "1:22624068034:web:08630239180807281db65b",
    measurementId: "G-FH65BH1RZK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
