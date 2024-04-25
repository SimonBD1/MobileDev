import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";
import {getStorage} from 'firebase/storage'
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAwsZNeMJQ3U_6XC6Ho5m14wabZ8F4mxLA",
  authDomain: "notebook-664e7.firebaseapp.com",
  projectId: "notebook-664e7",
  storageBucket: "notebook-664e7.appspot.com",
  messagingSenderId: "218273929568",
  appId: "1:218273929568:web:ac2bf08b31da7143b8e605",
  measurementId: "G-HC7PDBS240"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app)
const analytics = getAnalytics(app);
const storage = getStorage(app)
const auth = getAuth(app)
export{app, database, analytics, storage, auth}
