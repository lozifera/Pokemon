// Utilidad para manejar información del usuario
export const userUtils = {
  // Obtener usuario del localStorage de forma segura
  getUserFromStorage: () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData && userData !== 'undefined' && userData !== 'null') {
        return JSON.parse(userData)
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
    return null
  },

  // Obtener ID del usuario
  getUserId: () => {
    const user = userUtils.getUserFromStorage()
    return user?.id_usuario || user?.id || null
  },

  // Verificar si el usuario tiene los datos necesarios
  isUserValid: (user) => {
    return user && (user.id_usuario || user.id) && (user.nombre_usuario || user.nombre)
  },

  // Obtener información de depuración del usuario
  getUserDebugInfo: () => {
    const user = userUtils.getUserFromStorage()
    const token = localStorage.getItem('token')
    
    return {
      user,
      token: token ? 'Present' : 'Missing',
      userId: userUtils.getUserId(),
      isValid: userUtils.isUserValid(user),
      timestamp: new Date().toISOString()
    }
  }
}

export default userUtils
