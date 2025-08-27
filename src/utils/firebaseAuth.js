// Firebase configuration for Authentication (Google Login)
// Using the original Firebase config for backward compatibility

// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyB6tfpyYPiv3xfmg72cJ4LzHtABlD-YjL4",
    authDomain: "flowerssubscriptionservice.firebaseapp.com",
    projectId: "flowerssubscriptionservice",
    storageBucket: "flowerssubscriptionservice.firebasestorage.app",
    messagingSenderId: "262991343026"
};

// Initialize Firebase if not already initialized
export const initializeFirebase = () => {
    if (typeof window !== 'undefined' && window.firebase && !window.firebase.apps.length) {
        try {
            // Disable Firebase Hosting init.json request
            window.__FIREBASE_DEFAULTS__ = {
                config: firebaseConfig
            };

            window.firebase.initializeApp(firebaseConfig);
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.log('Firebase already initialized or error:', error.message);
        }
    }
};

// Get Firebase Auth instance
export const getFirebaseAuth = () => {
    if (typeof window !== 'undefined' && window.firebase) {
        return window.firebase.auth();
    }
    return null;
};

// Google Auth Provider
export const getGoogleProvider = () => {
    if (typeof window !== 'undefined' && window.firebase) {
        return new window.firebase.auth.GoogleAuthProvider();
    }
    return null;
};
