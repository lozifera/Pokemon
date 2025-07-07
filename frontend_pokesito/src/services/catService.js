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

// Servicio de categorías
export const catService = {
  // Obtener todas las categorías
  getAllCategorias: async () => {
    try {
      const response = await apiClient.get('/cat')
      return {
        success: true,
        data: response.data.datos || response.data, // Manejar tanto 'datos' como 'data'
        message: response.data.mensaje || 'Categorías obtenidas exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener categorías'
      }
    }
  },

  // Obtener una categoría por ID
  getCategoriaById: async (id) => {
    try {
      const response = await apiClient.get(`/cat/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Categoría obtenida exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al obtener categoría'
      }
    }
  },

  // Crear una nueva categoría
  createCategoria: async (categoriaData) => {
    try {
      // Para crear una categoría con imagen, usamos FormData
      const formData = new FormData()
      formData.append('nombre', categoriaData.nombre)
      if (categoriaData.imagen) {
        formData.append('imagen', categoriaData.imagen)
      }

      const response = await apiClient.post('/cat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Categoría creada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al crear categoría'
      }
    }
  },

  // Actualizar una categoría
  updateCategoria: async (id, categoriaData) => {
    try {
      // Para actualizar una categoría con imagen, usamos FormData
      const formData = new FormData()
      formData.append('nombre', categoriaData.nombre)
      if (categoriaData.imagen) {
        formData.append('imagen', categoriaData.imagen)
      }

      const response = await apiClient.put(`/cat/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Categoría actualizada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al actualizar categoría'
      }
    }
  },

  // Eliminar una categoría
  deleteCategoria: async (id) => {
    try {
      const response = await apiClient.delete(`/cat/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Categoría eliminada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar categoría'
      }
    }
  }
}

export default catService