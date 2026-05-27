// ============================================================
//  STEP 1: Replace these values with your Firebase project config
//  Go to: Firebase Console → Project Settings → Your apps → SDK setup
// ============================================================
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            "AIzaSyCMcQhTprPAXkZ5ys_Dg8TBOQ2rWuVSEUo",
  authDomain:        "allerai-8ac46.firebaseapp.com",
  projectId:         "allerai-8ac46",
  storageBucket:     "allerai-8ac46.firebasestorage.app",
  messagingSenderId: "707361802500",
  appId:             "1:707361802500:web:5ce20c15c6ab6a7bc76851",
  measurementId:     "G-BSQ7X5ZX3Z",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db   = getFirestore(app)
