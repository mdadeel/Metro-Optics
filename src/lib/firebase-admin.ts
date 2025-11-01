import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'

let firebaseAdminApp: App | undefined
let db: Firestore | undefined

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (firebaseAdminApp) {
    return firebaseAdminApp
  }

  // Check if already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    firebaseAdminApp = existingApps[0]
    db = getFirestore(firebaseAdminApp)
    return firebaseAdminApp
  }

  // Get Firebase credentials from environment
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  
  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is required')
  }

  if (!serviceAccount) {
    // For local development and Vercel, use Application Default Credentials
    // This works when running on Vercel with Firebase project linked
    // Or when using gcloud CLI locally
    try {
      firebaseAdminApp = initializeApp({
        projectId: projectId,
      })
      db = getFirestore(firebaseAdminApp)
      return firebaseAdminApp
      } catch {
        // If Application Default Credentials fail, try without explicit projectId
        // Firebase Admin will try to infer from environment
        try {
          firebaseAdminApp = initializeApp()
          db = getFirestore(firebaseAdminApp)
          return firebaseAdminApp
        } catch (fallbackError) {
          console.error('Firebase Admin initialization error:', fallbackError)
          // Don't throw - allow graceful degradation
          // The app will fail on first database operation if this doesn't work
          throw new Error('Firebase Admin SDK initialization failed. Please set FIREBASE_SERVICE_ACCOUNT_KEY or configure Application Default Credentials.')
        }
      }
  }

  // If service account key is provided as JSON string
  if (serviceAccount) {
    try {
      const serviceAccountJson = JSON.parse(serviceAccount)
      firebaseAdminApp = initializeApp({
        credential: cert(serviceAccountJson),
        projectId: serviceAccountJson.project_id || projectId,
      })
      db = getFirestore(firebaseAdminApp)
      return firebaseAdminApp
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error)
      throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY format')
    }
  }

  // Fallback: initialize with project ID only
  // This works if Application Default Credentials are configured
  firebaseAdminApp = initializeApp({
    projectId: projectId,
  })
  db = getFirestore(firebaseAdminApp)
  return firebaseAdminApp
}

// Initialize on module load (server-side only)
if (typeof window === 'undefined') {
  try {
    initializeFirebaseAdmin()
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error)
  }
}

export const getFirebaseAdmin = () => {
  if (!firebaseAdminApp) {
    initializeFirebaseAdmin()
  }
  return firebaseAdminApp!
}

export const getDb = (): Firestore => {
  if (!db) {
    initializeFirebaseAdmin()
  }
  return db!
}

export default getDb

