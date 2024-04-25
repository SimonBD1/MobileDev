import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyClu5kaUDmfUQ7lwXZp0PqkQ82WmHHCtoc",
authDomain: "myproject-c9714.firebaseapp.com",
projectId: "myproject-c9714",
storageBucket: "myproject-c9714.appspot.com",
messagingSenderId: "977331403082",
appId: "1:977331403082:web:9b8e1507fdb225515d29b3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { database, app }