import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { usuarioService } from '../../services/usuarioService'
import '../../styles/AdminUsuarios.css'

function AdminUsuarios() {
  const { user } = useAuth()
  
  // Estados para la lista de usuarios
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  
  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  
  // Estados para formularios
  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    es_admin: false
  })
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    console.log('AdminUsuarios: Iniciando carga de usuarios...')
    try {
      setLoading(true)
      setError('')
      
      const response = await usuarioService.getAllUsuarios()
      console.log('AdminUsuarios: Respuesta recibida:', response)
      console.log('AdminUsuarios: response.data:', response.data)
      console.log('AdminUsuarios: Tipo de response.data:', typeof response.data)
      console.log('AdminUsuarios: Es array response.data:', Array.isArray(response.data))
      
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
        console.log('AdminUsuarios: Usuarios cargados exitosamente:', finalUsuarios.length, finalUsuarios)
      } else {
        setError(response.message)
        console.error('AdminUsuarios: Error en respuesta:', response.message)
      }
    } catch (error) {
      setError('Error al cargar usuarios')
      console.error('AdminUsuarios: Error en catch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await usuarioService.createUsuario(newUser)
      if (response.success) {
        setShowCreateModal(false)
        setNewUser({
          nombre: '',
          apellido: '',
          email: '',
          contrasena: '',
          es_admin: false
        })
        loadUsuarios()
        alert('Usuario creado exitosamente')
      } else {
        alert(response.message)
      }
    } catch (error) {
      alert('Error al crear usuario')
      console.error('Error creating user:', error)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      const userId = selectedUser.id || selectedUser.id_usuario
      console.log(`🔑 AdminUsuarios - Cambiando contraseña para usuario ${userId}`)
      
      const response = await usuarioService.changePassword(userId, newPassword)
      
      if (response.success) {
        setShowPasswordModal(false)
        setNewPassword('')
        setConfirmPassword('')
        setSelectedUser(null)
        alert('✅ Contraseña actualizada exitosamente')
        console.log('✅ Contraseña cambiada exitosamente')
      } else {
        alert('❌ Error: ' + response.message)
        console.error('❌ Error al cambiar contraseña:', response.message)
      }
    } catch (error) {
      alert('❌ Error al cambiar contraseña')
      console.error('❌ Error changing password:', error)
    }
  }

  const handleToggleAdmin = async (userId, currentAdminStatus) => {
    if (userId === user.id || userId === user.id_usuario) {
      alert('No puedes cambiar tus propios permisos de administrador')
      return
    }

    try {
      console.log(`🔍 AdminUsuarios - Cambiando permisos de admin para usuario ${userId}`)
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
        console.log(`🔍 AdminUsuarios - Eliminando usuario ${userId}`)
        
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

  const filteredUsuarios = usuarios.filter(usuario => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (usuario.nombre || '').toLowerCase().includes(searchLower) ||
      (usuario.apellido || '').toLowerCase().includes(searchLower) ||
      (usuario.email || '').toLowerCase().includes(searchLower) ||
      String(usuario.id || usuario.id_usuario || '').toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="admin-usuarios-container">
      <header className="admin-usuarios-header">
        <div className="header-content">
          <h1>👥 Gestión de Usuarios</h1>
          <Link to="/admin" className="back-btn">
            ← Volver al Panel
          </Link>
        </div>
        <p className="header-description">
          Administra usuarios, permisos de administrador y contraseñas
        </p>
      </header>

      <div className="admin-usuarios-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-user-btn"
        >
          + Crear Usuario
        </button>
        <button
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="debug-toggle-btn"
        >
          {showDebugInfo ? 'Ocultar' : 'Mostrar'} Debug Info
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showDebugInfo && (
        <div className="debug-info">
          <h3>🔍 Debug Info</h3>
          <p><strong>Usuario actual:</strong> {user?.nombre} (ID: {user?.id || user?.id_usuario})</p>
          <p><strong>Es admin:</strong> {user?.admin || user?.es_admin ? 'Sí' : 'No'}</p>
          <p><strong>Total usuarios:</strong> {usuarios.length}</p>
          <p><strong>Usuarios filtrados:</strong> {filteredUsuarios.length}</p>
          <p><strong>Término de búsqueda:</strong> "{searchTerm}"</p>
          <details>
            <summary>Ver datos brutos de usuarios</summary>
            <pre>{JSON.stringify(usuarios, null, 2)}</pre>
          </details>
        </div>
      )}

      <div className="usuarios-table-container">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>ID</th>
              <th>Rol</th>
              <th>Registrado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users-row">
                  <div className="no-users-message">
                    <p>No se encontraron usuarios</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsuarios.map(usuario => {
                const usuarioId = usuario.id || usuario.id_usuario
                const isAdmin = usuario.admin || usuario.es_admin
                const isCurrentUser = usuarioId === user.id || usuarioId === user.id_usuario
                
                return (
                  <tr key={usuarioId} className={isCurrentUser ? 'current-user-row' : ''}>
                    <td>
                      <div className="user-name">
                        {usuario.nombre} {usuario.apellido}
                        {isCurrentUser && (
                          <span className="current-user-badge">TÚ</span>
                        )}
                      </div>
                    </td>
                    <td>{usuario.email}</td>
                    <td className="user-id">{usuarioId}</td>
                    <td>
                      {isAdmin ? (
                        <span className="admin-badge">ADMIN</span>
                      ) : (
                        <span className="user-badge">USER</span>
                      )}
                    </td>
                    <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleToggleAdmin(usuarioId, isAdmin)}
                          className={`action-btn ${isAdmin ? 'remove-admin' : 'make-admin'}`}
                          disabled={isCurrentUser}
                          title={isAdmin ? 'Quitar permisos de administrador' : 'Otorgar permisos de administrador'}
                        >
                          {isAdmin ? '👤' : '👑'}
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedUser(usuario)
                            setShowPasswordModal(true)
                          }}
                          className="action-btn change-password"
                          title="Cambiar contraseña del usuario"
                        >
                          🔑
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(usuarioId)}
                          className="action-btn delete-user"
                          disabled={isCurrentUser}
                          title="Eliminar usuario permanentemente"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para crear usuario */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Crear Nuevo Usuario</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={newUser.nombre}
                  onChange={(e) => setNewUser({...newUser, nombre: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Apellido:</label>
                <input
                  type="text"
                  value={newUser.apellido}
                  onChange={(e) => setNewUser({...newUser, apellido: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Contraseña:</label>
                <input
                  type="password"
                  value={newUser.contrasena}
                  onChange={(e) => setNewUser({...newUser, contrasena: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newUser.es_admin}
                    onChange={(e) => setNewUser({...newUser, es_admin: e.target.checked})}
                  />
                  Es Administrador
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Crear Usuario</button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cambiar Contraseña - {selectedUser?.nombre}</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Nueva Contraseña:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              
              <div className="form-group">
                <label>Confirmar Contraseña:</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
              
              <div className="modal-actions">
                <button type="submit" className="submit-btn">Cambiar Contraseña</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setNewPassword('')
                    setConfirmPassword('')
                    setSelectedUser(null)
                  }}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUsuarios
