import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function PrincipalClient() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // El componente ProtectedRoute ya maneja el caso de usuario no autenticado
  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

    return (
        <div className="dashboard-container">
        <header className="dashboard-header">
            <h1>Pokesito - Cliente</h1>
            <div>
            <span>Bienvenido, {user.nombre} {user.apellido}</span>
            <button onClick={handleLogout} className="logout-btn">
                Cerrar Sesión
            </button>
            </div>
        </header>
        
        <nav className="dashboard-nav">
            <Link to="/client/pokemons" className="nav-link">
            Ver Pokémon
            </Link>
            <Link to="/client/teams" className="nav-link">
            Constructor de Equipos
            </Link>
            <Link to="/client/profile" className="nav-link">
            Mi Perfil
            </Link>
            
            {/* Botón de Admin - Solo visible si el usuario es admin */}
            {user.admin && (
            <Link to="/admin" className="nav-link admin-btn">
                Panel de Administración
            </Link>
            )}
        </nav>
        
        <main className="dashboard-content">
            <h2>¡Bienvenido de vuelta, {user.nombre}!</h2>
            <p>¿Qué quieres hacer hoy?</p>
            
            <div className="dashboard-cards">
            <div className="card">
                <h3>Pokémon Favoritos</h3>
                <p>Explora y guarda tus Pokémon favoritos</p>
                <Link to="/client/pokemons" className="card-link">Ver Pokémon</Link>
            </div>
            
            <div className="card">
                <h3>Constructor de Equipos</h3>
                <p>Crea y gestiona tus equipos Pokémon competitivos</p>
                <Link to="/client/teams" className="card-link">Ir al Constructor</Link>
            </div>
            
            <div className="card">
                <h3>Mi Perfil</h3>
                <p>Actualiza tu información personal</p>
                <Link to="/client/profile" className="card-link">Ver Perfil</Link>
            </div>
            
            {/* Card de Admin - Solo visible si el usuario es admin */}
            {user.admin && (
                <div className="card admin-card">
                <h3>⚙️ Administración</h3>
                <p>Acceder al panel de administración</p>
                <Link to="/admin" className="card-link admin-link">Panel Admin</Link>
                </div>
            )}
            </div>
        </main>
        </div>
    )
    }

    export default PrincipalClient