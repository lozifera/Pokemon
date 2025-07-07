import { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

// Crear el contexto
const AuthContext = createContext()

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Función helper para limpiar datos de autenticación
  const clearAuthData = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
  }

  // Verificar si hay un usuario logueado al cargar la app
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')
        
        console.log('InitAuth - Token:', token)
        console.log('InitAuth - UserData raw:', userData)
        
        // Verificar si los datos son válidos
        if (token && userData && 
            token !== 'undefined' && token !== 'null' && 
            userData !== 'undefined' && userData !== 'null') {
          try {
            const parsedUser = JSON.parse(userData)
            console.log('InitAuth - Parsed user:', parsedUser)
            setUser(parsedUser)
            setIsAuthenticated(true)
          } catch (parseError) {
            console.error('Error al parsear datos de usuario:', parseError)
            // Limpiar datos corruptos
            clearAuthData()
          }
        } else {
          // Si hay datos inválidos, limpiarlos
          if (token === 'undefined' || userData === 'undefined' || 
              token === 'null' || userData === 'null') {
            console.log('Limpiando datos corruptos del localStorage')
            clearAuthData()
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error)
        // Limpiar datos corruptos
        clearAuthData()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Función de login
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      console.log('AuthContext: Respuesta completa:', response)
      
      if (response.success && response.data && response.data.data) {
        const { token, usuario } = response.data.data
        console.log('AuthContext: Token:', token)
        console.log('AuthContext: Usuario:', usuario)
        
        // Verificar que token y usuario no sean undefined antes de guardar
        if (token && usuario) {
          // Guardar en localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(usuario))
          
          // Actualizar estado
          setUser(usuario)
          setIsAuthenticated(true)
        } else {
          console.error('Token o usuario son undefined:', { token, usuario })
          return {
            success: false,
            message: 'Datos de autenticación incompletos'
          }
        }
        
        return response
      } else {
        return response
      }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: 'Error de conexión'
      }
    }
  }

  // Función de registro
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      console.error('Error en registro:', error)
      return {
        success: false,
        message: 'Error de conexión'
      }
    }
  }

  // Función de logout
  const logout = () => {
    // Limpiar todo usando la función helper
    clearAuthData()
    
    // Usar el servicio para limpiar (por si acaso)
    authService.logout()
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
