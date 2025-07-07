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

// Servicio de artículos
export const articuloService = {
  // Obtener todos los artículos
  getAllArticulos: async () => {
    try {
      const response = await apiClient.get('/articulos')
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Artículos obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener artículos'
      }
    }
  },

  // Obtener un artículo por ID
  getArticuloById: async (id) => {
    try {
      const response = await apiClient.get(`/articulos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Artículo obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener artículo'
      }
    }
  },

  // Crear un nuevo artículo
  createArticulo: async (articuloData) => {
    try {
      // Para crear un artículo con imagen, usamos FormData
      const formData = new FormData()
      formData.append('nombre', articuloData.nombre)
      formData.append('descripcion', articuloData.descripcion)
      if (articuloData.imagen) {
        formData.append('imagen', articuloData.imagen)
      }

      const response = await apiClient.post('/articulos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Artículo creado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al crear artículo'
      }
    }
  },

  // Actualizar un artículo
  updateArticulo: async (id, articuloData) => {
    try {
      // Para actualizar un artículo con imagen, usamos FormData
      const formData = new FormData()
      formData.append('nombre', articuloData.nombre)
      formData.append('descripcion', articuloData.descripcion)
      if (articuloData.imagen) {
        formData.append('imagen', articuloData.imagen)
      }

      const response = await apiClient.put(`/articulos/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Artículo actualizado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al actualizar artículo'
      }
    }
  },

  // Eliminar un artículo
  deleteArticulo: async (id) => {
    try {
      const response = await apiClient.delete(`/articulos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Artículo eliminado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar artículo'
      }
    }
  }
}

export default articuloService
