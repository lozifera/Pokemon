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

// Servicio de tipos
export const tipoService = {
  // Obtener todos los tipos
  getAllTipos: async () => {
    try {
      const response = await apiClient.get('/tipos')
      return {
        success: true,
        data: response.data.datos || response.data, // Manejar tanto 'datos' como 'data'
        message: response.data.mensaje || 'Tipos obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener tipos'
      }
    }
  },

  // Obtener un tipo por ID
  getTipoById: async (id) => {
    try {
      const response = await apiClient.get(`/tipos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Tipo obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener tipo'
      }
    }
  },

  // Crear un nuevo tipo
  createTipo: async (tipoData) => {
    try {
      // Para crear un tipo con imagen, usamos FormData
      const formData = new FormData()
      formData.append('nombre', tipoData.nombre)
      if (tipoData.imagen) {
        formData.append('imagen', tipoData.imagen)
      }

      const response = await apiClient.post('/tipos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Tipo creado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al crear tipo'
      }
    }
  },

  // Actualizar un tipo
  updateTipo: async (id, tipoData) => {
    try {
      const formData = new FormData()
      formData.append('nombre', tipoData.nombre)
      if (tipoData.imagen) {
        formData.append('imagen', tipoData.imagen)
      }

      const response = await apiClient.put(`/tipos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Tipo actualizado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al actualizar tipo'
      }
    }
  },

  // Eliminar un tipo
  deleteTipo: async (id) => {
    try {
      const response = await apiClient.delete(`/tipos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Tipo eliminado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar tipo'
      }
    }
  }
}

export default tipoService