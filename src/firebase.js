import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDs6je5izuKZ2SZY_aZwoX4O5EVWVUd7Dc",
  authDomain: "jobtracker-pro-58e13.firebaseapp.com",
  projectId: "jobtracker-pro-58e13",
  storageBucket: "jobtracker-pro-58e13.appspot.com",
  messagingSenderId: "450732084575",
  appId: "1:450732084575:web:1c6374de027c1b2dd8faea",
  measurementId: "G-6P112P690J"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);