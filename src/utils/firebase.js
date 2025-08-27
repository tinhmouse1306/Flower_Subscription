// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Unified Firebase config (Auth + Storage)
const firebaseConfig = {
    apiKey: "AIzaSyB6tfpyYPiv3xfmg72cJ4LzHtABlD-YjL4",
    authDomain: "flowerssubscriptionservice.firebaseapp.com",
    projectId: "flowerssubscriptionservice",
    storageBucket: "flowerssubscriptionservice.appspot.com",
    messagingSenderId: "262991343026",
    appId: "1:262991343026:web:5a28997955a6e6525108ab",
    measurementId: "G-TGE6JYHV8S"
};

// Disable Firebase Hosting init.json request
if (typeof window !== 'undefined') {
    window.__FIREBASE_DEFAULTS__ = {
        config: firebaseConfig
    };
}

// Initialize Firebase
console.log('🔥 Initializing Firebase with config:', firebaseConfig);
const app = initializeApp(firebaseConfig);
console.log('🔥 Firebase app initialized:', app);

// Initialize Auth
export const auth = getAuth(app);
console.log('🔥 Firebase Auth initialized:', auth);

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider();
console.log('🔥 Google Provider initialized:', googleProvider);

// Storage (bind explicitly to gs:// bucket)
export const storage = getStorage(app, 'gs://flowerssubscriptionservice.appspot.com');
console.log('🔥 Firebase Storage initialized:', storage);

// Helper function to test Firebase Auth
export const testFirebaseAuth = async () => {
    try {
        console.log('🧪 Testing Firebase Auth...');
        console.log('🧪 Auth object:', auth);
        console.log('🧪 Provider object:', googleProvider);

        // Test if signInWithPopup is available
        if (typeof signInWithPopup === 'function') {
            console.log('✅ signInWithPopup is available');
        } else {
            console.log('❌ signInWithPopup is not available');
        }

        // Test if signInWithRedirect is available
        if (typeof signInWithRedirect === 'function') {
            console.log('✅ signInWithRedirect is available');
        } else {
            console.log('❌ signInWithRedirect is not available');
        }

        // Test auth object methods
        console.log('🧪 Auth object methods:', {
            signInWithPopup: typeof auth.signInWithPopup,
            signInWithRedirect: typeof auth.signInWithRedirect,
            getRedirectResult: typeof auth.getRedirectResult
        });

        return true;
    } catch (error) {
        console.error('❌ Firebase Auth test failed:', error);
        return false;
    }
};

export default app;
