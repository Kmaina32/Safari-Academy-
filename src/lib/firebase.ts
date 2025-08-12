
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdf4on7PmsA6r1Ahb4vQmgCKxWlQAi_j0",
  authDomain: "facefinder-xvhoj.firebaseapp.com",
  projectId: "facefinder-xvhoj",
  storageBucket: "facefinder-xvhoj.firebasestorage.app",
  messagingSenderId: "993650061227",
  appId: "1:993650061227:web:30648b8d25bcb15bfa6cee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
