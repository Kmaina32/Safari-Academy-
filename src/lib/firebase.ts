// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "safari-academy",
  "appId": "1:77950866087:web:077dd6bb784e850d618182",
  "storageBucket": "safari-academy.firebasestorage.app",
  "apiKey": "AIzaSyCBDQDJuciLptV00kitKmf0oAXJ4OQonjI",
  "authDomain": "safari-academy.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "77950866087"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
