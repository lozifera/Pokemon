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
  // Obtener todos los equipos del usuario
  getUserEquipos: async () => {
    try {
      const response = await apiClient.get('/equipos')
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Equipos obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al obtener equipos'
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
  // Obtener todos los Pokémon de un equipo
  getEquipoPokemon: async (id_equipo) => {
    try {
      const response = await apiClient.get(`/equipo-pokemon?id_equipo=${id_equipo}`)
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
  updatePokemonInEquipo: async (id, pokemonData) => {
    try {
      const response = await apiClient.put(`/equipo-pokemon/${id}`, pokemonData)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokémon actualizado exitosamente'
      }
    } catch (error) {
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
  }
}

export default { equiposService, equipoPokemonService }
