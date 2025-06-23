// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initAnalytics } from './analytics';

const firebaseConfig = {
    apiKey: "AIzaSyCRb7u1WGakRWFYCdanp1PvOO3XR7F-F80",
    authDomain: "energy-guessr-app.firebaseapp.com",
    projectId: "energy-guessr-app",
    storageBucket: "energy-guessr-app.firebasestorage.app",
    messagingSenderId: "776522095712",
    appId: "1:776522095712:web:39478ec8eefb006ca33705",
    measurementId: "G-RNLZQV2HTX"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize analytics after app is created
if (typeof window !== 'undefined') {
  initAnalytics(app);
}

export { db, auth };