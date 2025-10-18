// lib/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get, query, orderByChild, equalTo, update, push, runTransaction, remove, Database } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, getRedirectResult, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, Firestore } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Database = getDatabase(app); // Realtime Database instance - FIXED
const db: Firestore = getFirestore(app); // Firestore instance
const provider: GoogleAuthProvider = new GoogleAuthProvider(); // Auth provider

export {
    app,
    auth,
    database,
    db,
    provider,
    // Firebase functions
    ref,
    onValue,
    set,
    get,
    query,
    orderByChild,
    equalTo,
    update,
    push,
    runTransaction,
    remove,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    getRedirectResult,
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc
};