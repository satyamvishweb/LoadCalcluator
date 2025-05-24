// src/Login/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuT2sK-8v2JKdU2hMIYXypYlKVVKU_rMY",
  authDomain: "loadcalculator-487cb.firebaseapp.com",
  projectId: "loadcalculator-487cb",
  storageBucket: "loadcalculator-487cb.firebasestorage.app",
  messagingSenderId: "696435074749",
  appId: "1:696435074749:web:da777eaf0c436a773df9d4",
  measurementId: "G-1CREZWJSJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
