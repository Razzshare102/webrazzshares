import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#020408' }}
      >
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#00d4ff', borderRightColor: '#7c3aed' }}
        />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin" replace />
  }

  return children
}
