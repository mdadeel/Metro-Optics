import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics } from 'firebase/analytics'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

let firebaseApp: FirebaseApp | undefined
let auth: Auth | undefined
let firestore: Firestore | undefined
let analytics: Analytics | undefined

// Firebase client configuration
// NOTE: All values should come from environment variables
// Never hardcode secrets in source code!
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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

