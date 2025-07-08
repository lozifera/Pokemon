import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usuarioService } from '../../services/usuarioService'
import { useState, useEffect } from 'react'
import '../../styles/PrincipalAdmin.css'

function PrincipalAdmin() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Estados para la gestión de usuarios
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsuarios = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Debug info
      console.log('🔍 PrincipalAdmin - Cargando usuarios...')
      console.log('Token:', localStorage.getItem('token'))
      console.log('Usuario actual:', user)
      
      const response = await usuarioService.getAllUsuarios()
      console.log('✅ PrincipalAdmin - Respuesta de usuarios:', response)
      console.log('✅ PrincipalAdmin - response.data:', response.data)
      console.log('✅ PrincipalAdmin - Tipo de response.data:', typeof response.data)
      console.log('✅ PrincipalAdmin - Es array response.data:', Array.isArray(response.data))
      
      if (response.success) {
        // Verificar si response.data es un array o si está dentro de una propiedad
        let usuariosData = response.data;
        
        // Si response.data no es un array, buscar el array en propiedades comunes
        if (!Array.isArray(usuariosData)) {
          console.log('❓ response.data no es array, buscando usuarios en propiedades...')
          usuariosData = response.data.usuarios || 
                        response.data.datos || 
                        response.data.data || 
                        response.data.users || 
                        [];
          console.log('✅ Usuarios encontrados en:', usuariosData)
        }
        
        // Asegurar que sea un array
        const finalUsuarios = Array.isArray(usuariosData) ? usuariosData : [];
        setUsuarios(finalUsuarios)
        console.log('✅ Usuarios finales cargados:', finalUsuarios.length, finalUsuarios)
      } else {
        setError(response.message || 'Error al cargar usuarios')
        console.error('❌ Error en la respuesta:', response.message)
      }
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error)
      setError('Error al cargar usuarios: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Función para probar la conexión con el API
  const testApiConnection = async () => {
    try {
      console.log('🔍 Probando conexión con API...')
      const token = localStorage.getItem('token')
      
      if (!token) {
        alert('❌ No hay token de autenticación')
        return
      }
      
      console.log('Token presente:', token.substring(0, 20) + '...')
      
      const response = await usuarioService.getAllUsuarios()
      
      if (response.success) {
        alert(`✅ Conexión exitosa! Se encontraron ${response.data?.length || 0} usuarios`)
      } else {
        alert(`❌ Error: ${response.message}`)
      }
    } catch (error) {
      console.error('Error de conexión:', error)
      alert(`❌ Error de conexión: ${error.message}`)
    }
  }

  // Función para probar el endpoint de actualización de usuario
  const testUpdateEndpoint = async () => {
    try {
      if (usuarios.length === 0) {
        alert('❌ No hay usuarios cargados para probar')
        return
      }

      // Tomar el primer usuario que no sea el actual
      const testUser = usuarios.find(u => 
        (u.id || u.id_usuario) !== (user.id || user.id_usuario)
      )

      if (!testUser) {
        alert('❌ No hay otros usuarios para probar')
        return
      }

      const userId = testUser.id || testUser.id_usuario
      const currentAdmin = testUser.admin || testUser.es_admin || false

      console.log(`🔍 Probando endpoint PUT /usuarios/${userId}`)
      console.log(`🔍 Usuario de prueba:`, testUser)
      console.log(`🔍 Estado admin actual: ${currentAdmin}`)

      // Probar cambio de admin sin realmente cambiar (doble toggle)
      const response1 = await usuarioService.toggleAdminPermission(userId, !currentAdmin)
      
      if (response1.success) {
        console.log('✅ Primera prueba exitosa')
        
        // Volver al estado original
        const response2 = await usuarioService.toggleAdminPermission(userId, currentAdmin)
        
        if (response2.success) {
          alert('✅ Endpoint PUT /usuarios/:id funciona correctamente!')
        } else {
          alert('⚠️ Primera prueba exitosa, segunda falló: ' + response2.message)
        }
      } else {
        alert('❌ Error en endpoint: ' + response1.message)
      }
    } catch (error) {
      console.error('Error de prueba:', error)
      alert(`❌ Error en prueba: ${error.message}`)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    if (userId === user.id || userId === user.id_usuario) {
      alert('No puedes cambiar tus propios permisos de administrador')
      return
    }

    try {
      console.log(`🔍 Cambiando permisos de admin para usuario ${userId}`)
      console.log(`🔍 Estado actual: ${currentAdminStatus}, nuevo estado: ${!currentAdminStatus}`)
      
      const response = await usuarioService.toggleAdminPermission(userId, !currentAdminStatus)
      
      if (response.success) {
        alert('✅ ' + (response.message || 'Permisos actualizados exitosamente'))
        console.log('✅ Permisos cambiados exitosamente')
        
        // Actualizar solo el usuario específico en lugar de recargar toda la lista
        setUsuarios(prevUsuarios => 
          prevUsuarios.map(usuario => 
            (usuario.id || usuario.id_usuario) === userId 
              ? { ...usuario, admin: !currentAdminStatus, es_admin: !currentAdminStatus }
              : usuario
          )
        )
      } else {
        alert('❌ Error: ' + response.message)
        console.error('❌ Error al cambiar permisos:', response.message)
      }
    } catch (error) {
      alert('❌ Error al cambiar permisos')
      console.error('❌ Error toggling admin permission:', error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (userId === user.id || userId === user.id_usuario) {
      alert('No puedes eliminar tu propia cuenta')
      return
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        console.log(`🔍 Eliminando usuario ${userId}`)
        
        const response = await usuarioService.deleteUsuario(userId)
        
        if (response.success) {
          alert('✅ Usuario eliminado exitosamente')
          console.log('✅ Usuario eliminado exitosamente')
          
          // Remover el usuario de la lista local
          setUsuarios(prevUsuarios => 
            prevUsuarios.filter(usuario => 
              (usuario.id || usuario.id_usuario) !== userId
            )
          )
        } else {
          alert('❌ Error: ' + response.message)
          console.error('❌ Error al eliminar usuario:', response.message)
        }
      } catch (error) {
        alert('❌ Error al eliminar usuario')
        console.error('❌ Error deleting user:', error)
      }
    }
  }

  // Filtrar usuarios por búsqueda
  const filteredUsuarios = Array.isArray(usuarios) ? usuarios.filter(usuario =>
    (usuario.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.apellido || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (usuario.correo || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  // El componente ProtectedRoute ya maneja la autenticación y autorización
  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button className="hamburger-menu" onClick={toggleMenu}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <h1>🔧 Panel de Administración</h1>
        </div>
        <div className="header-right">
          <span className="admin-info">Admin: {user.nombre} {user.apellido}</span>
          <Link to="/client" className="back-btn">
            Volver al Cliente
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>
      
      {/* Overlay para cerrar el menú */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      
      {/* Menú lateral */}
      <nav className={`sidebar-menu ${isMenuOpen ? 'menu-open' : ''}`}>
        <div className="menu-header">
          <h3>Menú de Administración</h3>
          <button className="close-menu" onClick={closeMenu}>×</button>
        </div>
        <ul className="menu-list">
          <li>
            <Link to="/admin/users" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">👥</span>
              <span className="menu-text">Gestionar Usuarios</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/tipos" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">🏷️</span>
              <span className="menu-text">Gestionar Tipos</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/categorias" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">📂</span>
              <span className="menu-text">Gestionar Categorías</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/movimientos" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">⚡</span>
              <span className="menu-text">Gestionar Movimientos</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/articulos" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">🎯</span>
              <span className="menu-text">Gestionar Artículos</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/habilidades" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">✨</span>
              <span className="menu-text">Gestionar Habilidades</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/pokemons" className="menu-item" onClick={closeMenu}>
              <span className="menu-icon">🎮</span>
              <span className="menu-text">Gestionar Pokémon</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <main className="dashboard-content">
        <div className="usuarios-section">
          <div className="usuarios-header">
            <h2>👥 Gestión de Usuarios</h2>
            <p>Administra usuarios, permisos y configuraciones del sistema</p>
          </div>

          <div className="usuarios-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="admin-actions">
              <button
                onClick={testApiConnection}
                className="test-api-btn"
                style={{
                  backgroundColor: '#9b59b6',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem'
                }}
              >
                🔍 Probar API
              </button>
              <button
                onClick={testUpdateEndpoint}
                className="test-update-btn"
                style={{
                  backgroundColor: '#e67e22',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem'
                }}
              >
                🔧 Probar PUT
              </button>
              <button
                onClick={loadUsuarios}
                className="refresh-btn"
                disabled={loading}
              >
                🔄 Actualizar Lista
              </button>
              <Link to="/admin/users" className="manage-users-btn">
                ⚙️ Gestión Completa
              </Link>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="usuarios-grid">
            {filteredUsuarios.length === 0 ? (
              <div className="no-users">
                <p>No se encontraron usuarios</p>
              </div>
            ) : (
              filteredUsuarios.map(usuario => (
                <div key={usuario.id || usuario.id_usuario} className="usuario-card">
                  <div className="usuario-header">
                    <h3>{usuario.nombre || 'Sin nombre'} {usuario.apellido || ''}</h3>
                    {(usuario.es_admin || usuario.admin) && (
                      <span className="admin-badge">ADMIN</span>
                    )}
                  </div>
                  
                  <div className="usuario-info">
                    <p><strong>Email:</strong> {usuario.email || usuario.correo || 'Sin email'}</p>
                    <p><strong>ID:</strong> {usuario.id || usuario.id_usuario || 'Sin ID'}</p>
                    <p><strong>Registrado:</strong> {
                      usuario.created_at 
                        ? new Date(usuario.created_at).toLocaleDateString() 
                        : usuario.fecha_registro 
                        ? new Date(usuario.fecha_registro).toLocaleDateString()
                        : 'Fecha no disponible'
                    }</p>
                  </div>

                  <div className="usuario-actions">
                    <button
                      onClick={() => handleToggleAdmin(
                        usuario.id || usuario.id_usuario, 
                        usuario.es_admin || usuario.admin
                      )}
                      className={`toggle-admin-btn ${
                        (usuario.es_admin || usuario.admin) ? 'remove-admin' : 'make-admin'
                      }`}
                      disabled={
                        (usuario.id || usuario.id_usuario) === (user.id || user.id_usuario)
                      }
                    >
                      {(usuario.es_admin || usuario.admin) ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteUser(usuario.id || usuario.id_usuario)}
                      className="delete-user-btn"
                      disabled={
                        (usuario.id || usuario.id_usuario) === (user.id || user.id_usuario)
                      }
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

export default PrincipalAdmin