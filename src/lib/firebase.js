import { initializeApp, getApps } from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

// ── Your Firebase project configuration ──────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'AIzaSyB1r2GO05iLuJ3QyuyXJ6Gj8I7W974vu8I',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'razzshares-e8133.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'razzshares-e8133',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'razzshares-e8133.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '512345472249',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '1:512345472249:web:72680b943f88e7da3bf628',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     ?? 'G-BVEXC8102N',
}

// Prevent duplicate app initialisation (HMR safe)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

// Auth instance
export const auth = getAuth(app)

// Analytics — only initialise in browser environments that support it
let analyticsInstance = null
isSupported().then((supported) => {
  if (supported) {
    analyticsInstance = getAnalytics(app)
  }
}).catch(() => {})
export const getAnalyticsInstance = () => analyticsInstance

// ── Auth helpers ──────────────────────────────────────────────────

/** Sign in with email + password. Returns { user, error } */
export const firebaseSignIn = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return { user: cred.user, error: null }
  } catch (err) {
    return { user: null, error: err }
  }
}

/** Sign out current user. Returns { error } */
export const firebaseSignOut = async () => {
  try {
    await fbSignOut(auth)
    return { error: null }
  } catch (err) {
    return { error: err }
  }
}

/**
 * Update password — requires re-authentication with the current password first.
 * Returns { error }
 */
export const firebaseUpdatePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser
    if (!user) throw new Error('No authenticated user')
    const credential = EmailAuthProvider.credential(user.email, currentPassword)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword)
    return { error: null }
  } catch (err) {
    return { error: err }
  }
}

export { onAuthStateChanged }
export default app
