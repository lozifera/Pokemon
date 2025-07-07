import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function PrincipalAdmin() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  // El componente ProtectedRoute ya maneja la autenticación y autorización
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
        <h1>🔧 Panel de Administración</h1>
        <div>
          <span>Admin: {user.nombre} {user.apellido}</span>
          <Link to="/client" className="back-btn">
            Volver al Cliente
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      <nav className="dashboard-nav">
        <Link to="/admin/users" className="nav-link">
          Gestionar Usuarios
        </Link>
        <Link to="/admin/tipos" className="nav-link">
          Gestionar Tipos
        </Link>
        <Link to="/admin/categorias" className="nav-link">
          Gestionar Categorías
        </Link>
        <Link to="/admin/movimientos" className="nav-link">
          Gestionar Movimientos
        </Link>
        <Link to="/admin/articulos" className="nav-link">
          Gestionar Artículos
        </Link>
        <Link to="/admin/pokemons" className="nav-link">
          Gestionar Pokémon
        </Link>
        <Link to="/admin/teams" className="nav-link">
          Ver Todos los Equipos
        </Link>
        <Link to="/admin/reports" className="nav-link">
          Reportes
        </Link>
      </nav>
      
      <main className="dashboard-content">
        <h2>Panel de Administración</h2>
        <p>Gestiona usuarios, Pokémon y configuraciones del sistema</p>
        
        <div className="dashboard-cards">
          <div className="card admin-card">
            <h3>👥 Usuarios</h3>
            <p>Gestionar cuentas de usuario y permisos</p>
            <Link to="/admin/users" className="card-link">Gestionar Usuarios</Link>
          </div>
          
          <div className="card admin-card">
            <h3>🏷️ Tipos</h3>
            <p>Gestionar tipos de Pokémon</p>
            <Link to="/admin/tipos" className="card-link">Gestionar Tipos</Link>
          </div>
          
          <div className="card admin-card">
            <h3>📂 Categorías</h3>
            <p>Gestionar categorías de Pokémon</p>
            <Link to="/admin/categorias" className="card-link">Gestionar Categorías</Link>
          </div>
          
          <div className="card admin-card">
            <h3>⚡ Movimientos</h3>
            <p>Gestionar movimientos de Pokémon</p>
            <Link to="/admin/movimientos" className="card-link">Gestionar Movimientos</Link>
          </div>
          
          <div className="card admin-card">
            <h3>� Artículos</h3>
            <p>Gestionar artículos del juego</p>
            <Link to="/admin/articulos" className="card-link">Gestionar Artículos</Link>
          </div>
          
          <div className="card admin-card">
            <h3>�🎮 Pokémon</h3>
            <p>Administrar datos de Pokémon</p>
            <Link to="/admin/pokemons" className="card-link">Gestionar Pokémon</Link>
          </div>
          
          <div className="card admin-card">
            <h3>⚔️ Equipos</h3>
            <p>Ver y moderar equipos de usuarios</p>
            <Link to="/admin/teams" className="card-link">Ver Equipos</Link>
          </div>
          
          <div className="card admin-card">
            <h3>📊 Reportes</h3>
            <p>Estadísticas y análisis del sistema</p>
            <Link to="/admin/reports" className="card-link">Ver Reportes</Link>
          </div>
          
          <div className="card admin-card">
            <h3>⚙️ Configuración</h3>
            <p>Configuraciones del sistema</p>
            <Link to="/admin/settings" className="card-link">Configuraciones</Link>
          </div>
          
          <div className="card admin-card">
            <h3>🔒 Seguridad</h3>
            <p>Logs y auditoría del sistema</p>
            <Link to="/admin/security" className="card-link">Seguridad</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PrincipalAdmin