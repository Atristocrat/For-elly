
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjUD-fyooXTdIU9rwAPtfYSbl9aPdkSuQ",
  authDomain: "for-elly-chat.firebaseapp.com",
  projectId: "for-elly-chat",
  storageBucket: "for-elly-chat.firebasestorage.app",
  messagingSenderId: "1007502575786",
  appId: "1:1007502575786:web:c9647e8ced20f5ce20e8d3"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export {
  app,
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
};
