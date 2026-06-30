import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './Spinner'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'candidate') return <Navigate to="/candidate/dashboard" replace />
    if (user.role === 'recruiter') return <Navigate to="/recruiter/dashboard" replace />
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

export default ProtectedRoute