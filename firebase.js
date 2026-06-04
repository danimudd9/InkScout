// ===================== firebase.js =====================
// Shared Firebase initialization — imported by every page that needs auth.
// Uses CDN builds so no bundler/npm is required.

import { initializeApp }        from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }              from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }         from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⚠️  BEFORE LAUNCH: Lock down Firebase Security Rules in the console
//     so users can only read/write their own documents.
const firebaseConfig = {
  apiKey:            "AIzaSyCgF4NR-4O-RZCosoGUzF5YIwhWEI4z1jY",
  authDomain:        "inkscout-0312.firebaseapp.com",
  projectId:         "inkscout-0312",
  storageBucket:     "inkscout-0312.firebasestorage.app",
  messagingSenderId: "401915418541",
  appId:             "1:401915418541:web:a7b029fb95e52e70733324",
  measurementId:     "G-RC3T5JSQSB"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db };