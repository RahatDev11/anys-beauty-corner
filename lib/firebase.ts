// lib/firebase.ts - আপনার existing ফাইল ঠিক আছে
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, get, query, orderByChild, equalTo, update, push, runTransaction, remove, Database } from 'firebase/database';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, getRedirectResult, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, Firestore } from 'firebase/firestore';

// Firebase Configuration - Direct Keys
const firebaseConfig = {
    apiKey: "AIzaSyCVSzQS1c7H4BLhsDF_fW8wnqUN4B35LPA",
    authDomain: "nahid-6714.firebaseapp.com",
    databaseURL: "https://nahid-6714-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "nahid-6714",
    storageBucket: "nahid-6714.firebasestorage.app",
    messagingSenderId: "505741217147",
    appId: "1:505741217147:web:25ed4e9f0d00e3c4d381de",
    measurementId: "G-QZ7CTRKHCW",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const database: Database = getDatabase(app);
const db: Firestore = getFirestore(app);

// Google Auth Provider তৈরি করুন
const createGoogleProvider = () => {
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope('profile');
    provider.addScope('email');
    // Force account selection
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    return provider;
};

export {
    app,
    auth,
    database,
    db,
    createGoogleProvider,
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