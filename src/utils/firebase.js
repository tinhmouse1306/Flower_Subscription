// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Unified Firebase config (Auth + Storage)
const firebaseConfig = {
    apiKey: "AIzaSyB6tfpyYPiv3xfmg72cJ4LzHtABlD-YjL4",
    authDomain: "flowerssubscriptionservice.firebaseapp.com",
    projectId: "flowerssubscriptionservice",
    // Use the canonical bucket host for SDK; map to gs:// below explicitly
    storageBucket: "flowerssubscriptionservice.appspot.com",
    messagingSenderId: "262991343026",
    appId: "1:262991343026:web:5a28997955a6e6525108ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Storage (bind explicitly to gs:// bucket)
export const storage = getStorage(app, 'gs://flowerssubscriptionservice.appspot.com');

export default app;
