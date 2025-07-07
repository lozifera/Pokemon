import axios from 'axios'

// Configuración base de axios
const API_BASE_URL = 'http://localhost:3001/api'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
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

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Servicio de habilidades
export const habilidadesService = {
  // Obtener todas las habilidades
  getAllHabilidades: async () => {
    try {
      const response = await apiClient.get('/habilidades')
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidades obtenidas exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener habilidades'
      }
    }
  },

  // Obtener una habilidad por ID
  getHabilidadById: async (id) => {
    try {
      const response = await apiClient.get(`/habilidades/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidad obtenida exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener habilidad'
      }
    }
  },

  // Crear una nueva habilidad
  createHabilidad: async (habilidadData) => {
    try {
      const response = await apiClient.post('/habilidades', habilidadData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidad creada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al crear habilidad'
      }
    }
  },

  // Actualizar una habilidad
  updateHabilidad: async (id, habilidadData) => {
    try {
      const response = await apiClient.put(`/habilidades/${id}`, habilidadData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidad actualizada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al actualizar habilidad'
      }
    }
  },

  // Eliminar una habilidad
  deleteHabilidad: async (id) => {
    try {
      const response = await apiClient.delete(`/habilidades/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidad eliminada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar habilidad'
      }
    }
  }
}

export default habilidadesService
