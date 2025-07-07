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

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Servicio de autenticación
export const authService = {
  // Función para login
  login: async (credentials) => {
    try {
      console.log('authService: Enviando credenciales:', credentials)
      const response = await apiClient.post('/usuarios/login', credentials)
      console.log('authService: Respuesta del servidor:', response.data)
      
      return {
        success: true,
        data: response.data,
        message: 'Login exitoso'
      }
    } catch (error) {
      console.error('authService: Error en login:', error.response?.data || error.message)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      }
    }
  },

  // Función para registro
  register: async (userData) => {
    try {
      const response = await apiClient.post('/usuarios/registro', userData)
      return {
        success: true,
        data: response.data,
        message: 'Registro exitoso'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || 'Error al registrar usuario'
      }
    }
  },

  // Función para logout (si necesitas limpiar token del localStorage)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Función para guardar token (si tu API devuelve token)
  saveToken: (token) => {
    localStorage.setItem('token', token)
  },

  // Función para obtener token
  getToken: () => {
    return localStorage.getItem('token')
  },

  // Función para verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  }
}

export default authService
