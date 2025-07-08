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
    // Log para debug
    console.log('equiposService - Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    })
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores globalmente
apiClient.interceptors.response.use(
  (response) => {
    // Log para debug
    console.log('equiposService - Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    })
    return response
  },
  (error) => {
    console.error('equiposService - Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url
    })
    return Promise.reject(error)
  }
)

// Servicio de equipos
export const equiposService = {
  // Obtener todos los equipos del usuario actual
  getUserEquipos: async (userId = null) => {
    try {
      const response = await apiClient.get('/equipos')
      
      // Si no se proporciona userId, intentar obtenerlo del token
      let currentUserId = userId
      
      if (!currentUserId) {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            // Decodificar el token para obtener el ID del usuario
            const tokenPayload = JSON.parse(atob(token.split('.')[1]))
            currentUserId = tokenPayload.id || tokenPayload.userId
          } catch (error) {
            console.warn('No se pudo decodificar el token:', error)
          }
        }
      }
      
      let equipos = response.data.datos || response.data
      
      // Filtrar equipos solo del usuario actual si tenemos el ID
      if (currentUserId && Array.isArray(equipos)) {
        equipos = equipos.filter(equipo => equipo.id_usuario === currentUserId)
        console.log(`Equipos filtrados para usuario ${currentUserId}:`, equipos)
      }
      
      return {
        success: true,
        data: equipos,
        message: response.data.mensaje || 'Equipos del usuario obtenidos exitosamente',
        total: equipos.length
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al obtener equipos'
      }
    }
  },

  // Obtener todos los equipos (solo para admin)
  getAllEquipos: async () => {
    try {
      const response = await apiClient.get('/equipos')
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Todos los equipos obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al obtener todos los equipos'
      }
    }
  },

  // Obtener un equipo por ID
  getEquipoById: async (id) => {
    try {
      const response = await apiClient.get(`/equipos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Equipo obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al obtener equipo'
      }
    }
  },

  // Crear un nuevo equipo
  createEquipo: async (equipoData) => {
    try {
      const response = await apiClient.post('/equipos', equipoData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Equipo creado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al crear equipo'
      }
    }
  },

  // Actualizar un equipo
  updateEquipo: async (id, equipoData) => {
    try {
      const response = await apiClient.put(`/equipos/${id}`, equipoData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Equipo actualizado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al actualizar equipo'
      }
    }
  },

  // Eliminar un equipo
  deleteEquipo: async (id) => {
    try {
      const response = await apiClient.delete(`/equipos/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Equipo eliminado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al eliminar equipo'
      }
    }
  }
}

// Servicio de Pokémon en equipos
export const equipoPokemonService = {
  // Obtener todos los Pokémon de un equipo usando la nueva ruta
  getEquipoPokemon: async (id_equipo) => {
    try {
      const response = await apiClient.get(`/equipos/${id_equipo}/pokemon`)
      console.log('getEquipoPokemon Response:', response.data)
      
      // Extraer solo los Pokémon del nuevo formato de respuesta
      const pokemonData = response.data.datos?.pokemon || response.data.pokemon || []
      
      return {
        success: true,
        data: pokemonData,
        message: response.data.mensaje || 'Pokémon del equipo obtenidos exitosamente',
        equipo: response.data.datos?.equipo || null,
        total: response.data.datos?.total_pokemon || pokemonData.length
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al obtener Pokémon del equipo'
      }
    }
  },

  // Método legacy para compatibilidad (usando la ruta antigua)
  getEquipoPokemonLegacy: async (id_equipo) => {
    try {
      const response = await apiClient.get(`/equipo-pokemon?id_equipo=${id_equipo}`)
      console.log('getEquipoPokemonLegacy Response:', response.data)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokémon del equipo obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al obtener Pokémon del equipo'
      }
    }
  },

  // Agregar un Pokémon al equipo
  addPokemonToEquipo: async (pokemonData) => {
    try {
      console.log('equiposService - Enviando datos para agregar Pokémon:', pokemonData)
      const response = await apiClient.post('/equipo-pokemon', pokemonData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokémon agregado al equipo exitosamente'
      }
    } catch (error) {
      console.error('equiposService - Error al agregar Pokémon:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        pokemonData: pokemonData
      })
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 
                error.response?.data?.error || 
                error.response?.data?.message || 
                error.message || 
                'Error al agregar Pokémon al equipo'
      }
    }
  },

  // Actualizar un Pokémon en el equipo
  updateEquipoPokemon: async (id, pokemonData) => {
    try {
      console.log('PUT /equipo-pokemon/' + id, 'Payload:', pokemonData)
      const response = await apiClient.put(`/equipo-pokemon/${id}`, pokemonData)
      console.log('PUT Response:', response.data)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokémon actualizado exitosamente'
      }
    } catch (error) {
      console.error('PUT /equipo-pokemon/' + id + ' ERROR:', error.response?.data || error.message)
      console.error('Full error:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al actualizar Pokémon'
      }
    }
  },

  // Eliminar un Pokémon del equipo
  removePokemonFromEquipo: async (id) => {
    try {
      const response = await apiClient.delete(`/equipo-pokemon/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokémon eliminado del equipo exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al eliminar Pokémon del equipo'
      }
    }
  },

  // Método de prueba para verificar la nueva ruta
  testNewRoute: async (id_equipo) => {
    try {
      console.log('🔍 Probando nueva ruta:', `/equipos/${id_equipo}/pokemon`)
      const response = await apiClient.get(`/equipos/${id_equipo}/pokemon`)
      console.log('✅ Respuesta exitosa:', response.data)
      
      // Mostrar estructura de la respuesta
      console.log('📊 Estructura de respuesta:')
      console.log('- exito:', response.data.exito)
      console.log('- mensaje:', response.data.mensaje)
      console.log('- datos.equipo:', response.data.datos?.equipo)
      console.log('- datos.pokemon:', response.data.datos?.pokemon)
      console.log('- datos.total_pokemon:', response.data.datos?.total_pokemon)
      
      return {
        success: true,
        data: response.data,
        message: 'Prueba exitosa de la nueva ruta'
      }
    } catch (error) {
      console.error('❌ Error en la nueva ruta:', error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al probar la nueva ruta'
      }
    }
  }
}

export default { equiposService, equipoPokemonService }
