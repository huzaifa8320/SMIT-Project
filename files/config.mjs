// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

//   Auth provider Importing 
import { GoogleAuthProvider , getAuth , signInWithPopup , onAuthStateChanged , createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Firestore provider Importing
import { getFirestore , collection, addDoc , setDoc , doc , getDoc , getDocs} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyClyAIBdoVZQlNOrb6qR7r87CmOLKZqPH4",
    authDomain: "smit-practical-test.firebaseapp.com",
    projectId: "smit-practical-test",
    storageBucket: "smit-practical-test.appspot.com",
    messagingSenderId: "789979864984",
    appId: "1:789979864984:web:aca6dd9bbd47359d8ad5ed"
};

// Initialize 
const app = initializeApp(firebaseConfig);
const google_option = new GoogleAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

export {
    app,
    google_option,
    auth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    db,
    collection,
    addDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setDoc,
    doc,
    getDoc,
    signOut, 
    getDocs
}