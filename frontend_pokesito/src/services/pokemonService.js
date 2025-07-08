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

// Servicio de Pokemon
export const pokemonService = {
  // Obtener todos los Pokemon
  getAllPokemon: async () => {
    try {
      const response = await apiClient.get('/pokemon')
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokemon obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener Pokemon'
      }
    }
  },

  // Obtener un Pokemon por ID
  getPokemonById: async (id) => {
    try {
      const response = await apiClient.get(`/pokemon/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokemon obtenido exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener Pokemon'
      }
    }
  },

  // Crear un nuevo Pokemon (usando FormData para la imagen)
  createPokemon: async (pokemonData) => {
    try {
      console.log('🎯 Creando Pokemon con datos:', pokemonData)
      
      // Si no hay imagen, enviar como JSON
      if (!pokemonData.image) {
        console.log('📤 Enviando sin imagen como JSON')
        const response = await apiClient.post('/pokemon', {
          nombre_pok: pokemonData.nombre_pok,
          HP: parseInt(pokemonData.HP),
          ataque: parseInt(pokemonData.ataque),
          defensa: parseInt(pokemonData.defensa),
          sp_ataque: parseInt(pokemonData.sp_ataque),
          sp_defensa: parseInt(pokemonData.sp_defensa),
          velocidad: parseInt(pokemonData.velocidad)
        })
        
        return {
          success: true,
          data: response.data.datos || response.data,
          message: response.data.mensaje || 'Pokemon creado exitosamente'
        }
      }
      
      // Si hay imagen, usar FormData
      const formData = new FormData()
      
      // Agregar datos del Pokemon
      formData.append('nombre_pok', pokemonData.nombre_pok)
      formData.append('HP', pokemonData.HP)
      formData.append('ataque', pokemonData.ataque)
      formData.append('defensa', pokemonData.defensa)
      formData.append('sp_ataque', pokemonData.sp_ataque)
      formData.append('sp_defensa', pokemonData.sp_defensa)
      formData.append('velocidad', pokemonData.velocidad)
      
      // Probar diferentes nombres para el campo de imagen
      formData.append('imagen', pokemonData.image)

      console.log('📦 Enviando FormData al backend:')
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value)
      }

      const response = await apiClient.post('/pokemon', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokemon creado exitosamente'
      }
    } catch (error) {
      console.error('💥 Error al crear Pokemon:', error)
      console.error('📋 Error response:', error.response)
      console.error('📋 Error data:', error.response?.data)
      console.error('📋 Error status:', error.response?.status)
      
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || error.message || 'Error al crear Pokemon'
      }
    }
  },

  // Actualizar un Pokemon
  updatePokemon: async (id, pokemonData) => {
    try {
      const formData = new FormData()
      
      // Agregar datos del Pokemon
      formData.append('nombre_pok', pokemonData.nombre_pok)
      formData.append('HP', pokemonData.HP)
      formData.append('ataque', pokemonData.ataque)
      formData.append('defensa', pokemonData.defensa)
      formData.append('sp_ataque', pokemonData.sp_ataque)
      formData.append('sp_defensa', pokemonData.sp_defensa)
      formData.append('velocidad', pokemonData.velocidad)
      
      // Agregar imagen si existe - usar 'imagen' en lugar de 'image'
      if (pokemonData.image) {
        formData.append('imagen', pokemonData.image)
      }

      console.log('📦 Actualizando Pokemon con FormData:')
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value)
      }

      const response = await apiClient.put(`/pokemon/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokemon actualizado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al actualizar Pokemon'
      }
    }
  },

  // Eliminar un Pokemon
  deletePokemon: async (id) => {
    try {
      const response = await apiClient.delete(`/pokemon/${id}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Pokemon eliminado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al eliminar Pokemon'
      }
    }
  },

  // Métodos para gestionar relaciones individuales
  
  // Obtener movimientos de un Pokemon
  getPokemonMovimientos: async (pokemonId) => {
    try {
      const response = await apiClient.get(`/pokemon-movimiento/pokemon/${pokemonId}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Movimientos obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener movimientos'
      }
    }
  },

  // Obtener habilidades de un Pokemon
  getPokemonHabilidades: async (pokemonId) => {
    try {
      const response = await apiClient.get(`/pokemon-habilidad/pokemon/${pokemonId}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidades obtenidas exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener habilidades'
      }
    }
  },

  // Obtener tipos de un Pokemon
  getPokemonTipos: async (pokemonId) => {
    try {
      const response = await apiClient.get(`/pokemon-tipo/pokemon/${pokemonId}`)
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Tipos obtenidos exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al obtener tipos'
      }
    }
  },

  // Agregar movimiento a un Pokemon
  addPokemonMovimiento: async (pokemonId, movimientoId) => {
    try {
      const response = await apiClient.post('/pokemon-movimiento', {
        id_pokemon: pokemonId,
        id_movimiento: movimientoId
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Movimiento agregado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al agregar movimiento'
      }
    }
  },

  // Agregar habilidad a un Pokemon
  addPokemonHabilidad: async (pokemonId, habilidadId, tipo = 'normal') => {
    try {
      const response = await apiClient.post('/pokemon-habilidad', {
        id_pokemon: pokemonId,
        id_habilidad: habilidadId,
        tipo: tipo
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Habilidad agregada exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al agregar habilidad'
      }
    }
  },

  // Agregar tipo a un Pokemon
  addPokemonTipo: async (pokemonId, tipoId) => {
    try {
      const response = await apiClient.post('/pokemon-tipo', {
        id_pokemon: pokemonId,
        id_tipo: tipoId
      })
      return {
        success: true,
        data: response.data.datos || response.data,
        message: response.data.mensaje || 'Tipo agregado exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al agregar tipo'
      }
    }
  },

  // Eliminar todas las relaciones de un Pokemon (útil para actualizar)
  deletePokemonRelations: async (pokemonId) => {
    try {
      const promises = [
        apiClient.delete(`/pokemon-movimiento/pokemon/${pokemonId}`),
        apiClient.delete(`/pokemon-habilidad/pokemon/${pokemonId}`),
        apiClient.delete(`/pokemon-tipo/pokemon/${pokemonId}`)
      ]
      
      await Promise.all(promises)
      return {
        success: true,
        data: null,
        message: 'Relaciones eliminadas exitosamente'
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.mensaje || 'Error al eliminar relaciones'
      }
    }
  },
}

export default pokemonService
