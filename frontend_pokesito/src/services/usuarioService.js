import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = 'http://localhost:3001/api'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Servicio de Usuarios
export const usuarioService = {
  // Obtener todos los usuarios (solo admin)
  getAllUsuarios: async () => {
    try {
      console.log('🔍 usuarioService.getAllUsuarios - Enviando request...')
      const response = await apiClient.get('/usuarios')
      console.log('✅ usuarioService.getAllUsuarios - Respuesta completa:', response)
      console.log('✅ usuarioService.getAllUsuarios - response.data:', response.data)
      console.log('✅ usuarioService.getAllUsuarios - response.data.datos:', response.data.datos)
      
      // Extraer los datos de usuarios de diferentes posibles estructuras
      let userData = response.data.datos || response.data.data || response.data.usuarios || response.data;
      
      // Si aún no es un array, intentar extraer de propiedades comunes
      if (!Array.isArray(userData) && typeof userData === 'object') {
        console.log('❓ userData no es array, explorando propiedades...')
        console.log('❓ Propiedades de userData:', Object.keys(userData))
        
        // Buscar arrays en las propiedades del objeto
        for (const key of Object.keys(userData)) {
          if (Array.isArray(userData[key])) {
            console.log(`✅ Encontrado array en propiedad '${key}':`, userData[key])
            userData = userData[key];
            break;
          }
        }
      }
      
      console.log('✅ usuarioService.getAllUsuarios - userData final:', userData)
      console.log('✅ usuarioService.getAllUsuarios - Es array:', Array.isArray(userData))
      
      return {
        success: true,
        data: userData,
        message: response.data.mensaje || 'Usuarios obtenidos exitosamente'
      }
    } catch (error) {
      console.error('❌ usuarioService.getAllUsuarios - Error:', error)
      console.error('❌ usuarioService.getAllUsuarios - Error response:', error.response?.data)
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener usuarios'
      }
    }
  },

  // Obtener usuario por ID
  getUsuarioById: async (id) => {
    try {
      const response = await apiClient.get(`/usuarios/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Usuario obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener usuario'
      }
    }
  },

  // Crear usuario (solo admin puede crear otros admins)
  createUsuario: async (userData) => {
    try {
      const response = await apiClient.post('/usuarios/registro', userData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Usuario creado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al crear usuario'
      }
    }
  },

  // Actualizar usuario
  updateUsuario: async (id, userData) => {
    try {
      const response = await apiClient.put(`/usuarios/${id}`, userData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Usuario actualizado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al actualizar usuario'
      }
    }
  },

  // Cambiar contraseña de usuario (solo admin)
  changePassword: async (userId, newPassword) => {
    try {
      console.log(`🔑 Cambiando contraseña para usuario ${userId}`)
      console.log(`📡 PATCH /usuarios/${userId}`)
      console.log('📦 Payload:', { contraseña: newPassword })
      
      const response = await apiClient.patch(`/usuarios/${userId}`, {
        contraseña: newPassword
      })
      
      console.log('✅ Respuesta del servidor:', response.data)
      
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Contraseña actualizada exitosamente'
      }
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error.response?.data || error.message)
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al cambiar contraseña'
      }
    }
  },

  // Cambiar permisos de administrador
  toggleAdminPermission: async (userId, isAdmin) => {
    try {
      console.log(`🔍 toggleAdminPermission - Cambiando admin status para usuario ${userId} a ${isAdmin}`)
      
      // Probar diferentes formatos de campo
      const payloadOptions = [
        { admin: isAdmin },           // Formato 1: admin
        { es_admin: isAdmin },        // Formato 2: es_admin
        { admin: isAdmin, es_admin: isAdmin }  // Formato 3: ambos
      ]
      
      let lastError = null
      
      // Intentar con cada formato
      for (let i = 0; i < payloadOptions.length; i++) {
        try {
          const payload = payloadOptions[i]
          console.log(`🔍 Intentando con payload ${i + 1}:`, payload)
          
          const response = await apiClient.put(`/usuarios/${userId}`, payload)
          console.log('✅ toggleAdminPermission - Éxito con payload:', payload)
          console.log('✅ toggleAdminPermission - Respuesta:', response.data)
          
          return {
            success: true,
            data: response.data.datos || response.data,
            message: response.data.mensaje || 'Permisos actualizados exitosamente'
          }
        } catch (error) {
          console.log(`❌ Falló intento ${i + 1}:`, error.response?.status, error.response?.data)
          lastError = error
          continue
        }
      }
      
      // Si llegamos aquí, todos los intentos fallaron
      throw lastError
      
    } catch (error) {
      console.error('❌ toggleAdminPermission - Error final:', error)
      console.error('❌ toggleAdminPermission - Error response:', error.response?.data)
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al actualizar permisos'
      }
    }
  },

  // Eliminar usuario (solo admin)
  deleteUsuario: async (id) => {
    try {
      const response = await apiClient.delete(`/usuarios/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Usuario eliminado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al eliminar usuario'
      }
    }
  },

  // Obtener perfil del usuario actual
  getPerfil: async () => {
    try {
      const response = await apiClient.get('/usuarios/perfil')
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Perfil obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener perfil'
      }
    }
  }
}

export default usuarioService
