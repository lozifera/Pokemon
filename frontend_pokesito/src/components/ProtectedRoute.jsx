import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAuthenticated } = useAuth()

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Si es una ruta de admin y el usuario no es admin, redirigir
  if (adminOnly && !user.admin) {
    return <Navigate to="/client" replace />
  }

  // Si todo está bien, mostrar el componente
  return children
}

export default ProtectedRoute
