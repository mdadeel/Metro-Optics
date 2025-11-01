import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics } from 'firebase/analytics'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined
let analytics: Analytics | undefined

// Firebase client configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDgmlJSL7LK6Oi9-B49R50v-JCUIVf9vyY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "metro-optics.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "metro-optics",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "metro-optics.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "543309844199",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:543309844199:web:0acd64a88b435a6bf65c42",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F775F56ZYV",
}

// Initialize Firebase (client-side only)
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client SDK can only be used in the browser')
  }

  if (firebaseApp) {
    return firebaseApp
  }

  const existingApps = getApps()
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0]
    return firebaseApp
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Firebase configuration is missing. Please check your environment variables.')
  }

  firebaseApp = initializeApp(firebaseConfig)
  return firebaseApp
}

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used in the browser')
  }

  if (!auth) {
    const app = getFirebaseApp()
    auth = getAuth(app)
  }
  return auth
}

export function getFirebaseFirestore(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Firestore can only be used in the browser')
  }

  if (!firestore) {
    const app = getFirebaseApp()
    firestore = getFirestore(app)
  }
  return firestore
}

export function getFirebaseAnalytics(): Analytics | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (!analytics) {
    const app = getFirebaseApp()
    try {
      analytics = getAnalytics(app)
    } catch (error) {
      console.warn('Firebase Analytics initialization failed:', error)
      return null
    }
  }
  return analytics
}

