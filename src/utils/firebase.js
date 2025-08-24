// Firebase configuration
export const firebaseConfig = {
    apiKey: "AIzaSyCf6pp9cLr1MBW2PPF7p4cY7pa9aFG-q1o",
    authDomain: "flower-subscription-7c9aa.firebaseapp.com",
    projectId: "flower-subscription-7c9aa",
    storageBucket: "flower-subscription-7c9aa.firebasestorage.app",
    messagingSenderId: "622147275176",
    appId: "1:622147275176:web:9bcfa2ba8a3835883af59d",
    measurementId: "G-KZJWRLGR0R"
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
