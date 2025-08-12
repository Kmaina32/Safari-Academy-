// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBDQDJuciLptV00kitKmf0oAXJ4OQonjI",
  authDomain: "safari-academy.firebaseapp.com",
  projectId: "safari-academy",
  storageBucket: "safari-academy.appspot.com",
  messagingSenderId: "77950866087",
  appId: "1:77950866087:web:71e8a83441535ba6284a3c"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
