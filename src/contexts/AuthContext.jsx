import { createContext, useContext, useEffect, useState } from 'react'
import {
  auth,
  firebaseSignIn,
  firebaseSignOut,
  onAuthStateChanged,
} from '../lib/firebase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  /** Sign in with email + password */
  const signIn = async (email, password) => {
    const { user, error } = await firebaseSignIn(email, password)
    return { data: user ? { user } : null, error }
  }

  /** Sign out current user */
  const signOut = async () => {
    return await firebaseSignOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
    isAdmin: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
