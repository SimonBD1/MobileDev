// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDa-iyrZ8jI3gedqAwPfwcrBTi5D2KZQGs",
  authDomain: "mapdemo-35f0f.firebaseapp.com",
  projectId: "mapdemo-35f0f",
  storageBucket: "mapdemo-35f0f.appspot.com",
  messagingSenderId: "883093055024",
  appId: "1:883093055024:web:c775555f4bac771b642ff5",
  measurementId: "G-7XT8QKD44Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const storage = getStorage(app)

export {app, database, storage} 