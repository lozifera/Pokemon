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

// Servicio de movimientos
export const movimientosService = {
  // Obtener todos los movimientos
  getAllMovimientos: async () => {
    console.log('🚀 movimientosService: Iniciando getAllMovimientos')
    try {
      console.log('🌐 movimientosService: Haciendo petición GET a /movimientos')
      const response = await apiClient.get('/movimientos')
      console.log('📡 movimientosService: Respuesta recibida:', response)
      console.log('📦 movimientosService: Data de respuesta:', response.data)
      
      return {
        success: true,
        data: response.data.datos || response.data.data, // Manejar ambas estructuras
        message: response.data.mensaje || response.data.message || 'Movimientos obtenidos exitosamente'
      }
    } catch (error) {
      console.error('💥 movimientosService: Error en getAllMovimientos:', error)
      console.error('📋 movimientosService: Error response:', error.response)
      console.error('📋 movimientosService: Error message:', error.message)
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.response?.data?.mensaje || 'Error al obtener movimientos'
      }
    }
  },

  // Obtener un movimiento por ID
  getMovimientoById: async (id) => {
    try {
      const response = await apiClient.get(`/movimientos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Movimiento obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener movimiento'
      }
    }
  },

  // Crear un nuevo movimiento
  createMovimiento: async (movimientoData) => {
    try {
      const response = await apiClient.post('/movimientos', movimientoData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Movimiento creado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al crear movimiento'
      }
    }
  },

  // Actualizar un movimiento
  updateMovimiento: async (id, movimientoData) => {
    try {
      const response = await apiClient.put(`/movimientos/${id}`, movimientoData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Movimiento actualizado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al actualizar movimiento'
      }
    }
  },

  // Eliminar un movimiento
  deleteMovimiento: async (id) => {
    try {
      const response = await apiClient.delete(`/movimientos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Movimiento eliminado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar movimiento'
      }
    }
  }
}

export default movimientosService
