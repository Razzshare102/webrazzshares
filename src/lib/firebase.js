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

// ── Firebase config (all values come from Vite env vars) ──────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Warn in dev if env vars are missing
if (import.meta.env.DEV) {
  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k)
  if (missing.length) {
    console.warn('[Firebase] Missing env vars:', missing.join(', '))
    console.warn('[Firebase] Running in demo mode — auth will not work until vars are set.')
  }
}

// Prevent duplicate app initialisation (HMR safe)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)

// ── Convenience auth helpers ──────────────────────────────────────

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

/** Update password for the currently signed-in user.
 *  Requires re-authentication first — pass currentPassword.
 *  Returns { error }
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
