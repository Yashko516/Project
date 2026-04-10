// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBssQ10Odzv_rTwiaP862fnjm4v0sInMjA",
  authDomain: "voleyballscounting.firebaseapp.com",
  projectId: "voleyballscounting",
  storageBucket: "voleyballscounting.firebasestorage.app",
  messagingSenderId: "185305965244",
  appId: "1:185305965244:web:ea6becee59b9c828f526b9",
  measurementId: "G-M7ZQL78QL7"
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Initialize Firebase
let app;
let auth;
let db;
let analytics;

try {
  if (typeof window !== 'undefined') {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Analytics is optional
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.log('Analytics not available:', error);
    }
    
    console.log('Firebase initialized successfully');
    console.log('Project ID:', firebaseConfig.projectId);
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

// Export instances for use in the app
export { app, auth, db, analytics };

// Helper functions for Firebase operations
export const initializeFirebase = () => {
  try {
    if (!app && typeof window !== 'undefined') {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log('Firebase initialized on demand');
    }
    return app;
  } catch (error) {
    console.error('Error with Firebase initialization:', error);
    return null;
  }
};

export const getFirebaseAuth = () => auth;
export const getFirestoreDB = () => db;

// Sign out from Firebase
export const signOutFirebase = async () => {
  try {
    if (auth) {
      await auth.signOut();
      console.log('Signed out from Firebase');
      return true;
    }
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

export default firebaseConfig;