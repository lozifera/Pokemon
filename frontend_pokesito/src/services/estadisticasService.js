// Servicio para manejo de estadísticas de Pokémon
const API_BASE_URL = 'http://localhost:3001/api'

const estadisticasService = {
  // Crear IVs (Individual Values)
  async createIVs(ivsData) {
    try {
      const token = localStorage.getItem('token')
      
      console.log('=== CREANDO IVS ===')
      console.log('Datos a enviar:', ivsData)
      
      const response = await fetch(`${API_BASE_URL}/ivs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ivsData)
      })

      const result = await response.json()
      console.log('Respuesta IVs:', result)
      
      return {
        success: response.ok,
        data: result,
        message: result.message || 'IVs creados'
      }
    } catch (error) {
      console.error('Error creando IVs:', error)
      return {
        success: false,
        message: error.message || 'Error al crear IVs'
      }
    }
  },

  // Crear EVs (Effort Values)
  async createEVs(evsData) {
    try {
      const token = localStorage.getItem('token')
      
      console.log('=== CREANDO EVS ===')
      console.log('Datos a enviar:', evsData)
      
      const response = await fetch(`${API_BASE_URL}/evs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(evsData)
      })

      const result = await response.json()
      console.log('Respuesta EVs:', result)
      
      return {
        success: response.ok,
        data: result,
        message: result.message || 'EVs creados'
      }
    } catch (error) {
      console.error('Error creando EVs:', error)
      return {
        success: false,
        message: error.message || 'Error al crear EVs'
      }
    }
  },

  // Crear Naturaleza
  async createNaturaleza(naturalezaData) {
    try {
      const token = localStorage.getItem('token')
      
      console.log('=== CREANDO NATURALEZA ===')
      console.log('Datos a enviar:', naturalezaData)
      
      const response = await fetch(`${API_BASE_URL}/naturalezas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(naturalezaData)
      })

      const result = await response.json()
      console.log('Respuesta Naturaleza:', result)
      
      return {
        success: response.ok,
        data: result,
        message: result.message || 'Naturaleza creada'
      }
    } catch (error) {
      console.error('Error creando Naturaleza:', error)
      return {
        success: false,
        message: error.message || 'Error al crear Naturaleza'
      }
    }
  },

  // Crear Estadísticas finales
  async createEstadisticas(estadisticasData) {
    try {
      const token = localStorage.getItem('token')
      
      console.log('=== CREANDO ESTADÍSTICAS ===')
      console.log('Datos a enviar:', estadisticasData)
      
      const response = await fetch(`${API_BASE_URL}/estadisticas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(estadisticasData)
      })

      const result = await response.json()
      console.log('Respuesta Estadísticas:', result)
      
      return {
        success: response.ok,
        data: result,
        message: result.message || 'Estadísticas creadas'
      }
    } catch (error) {
      console.error('Error creando Estadísticas:', error)
      return {
        success: false,
        message: error.message || 'Error al crear Estadísticas'
      }
    }
  },

  // Actualizar Pokémon en equipo usando PATCH
  async updateEquipoPokemon(pokemonId, updateData) {
    try {
      const token = localStorage.getItem('token')
      
      console.log('=== ACTUALIZANDO EQUIPO POKEMON (PATCH) ===')
      console.log('ID:', pokemonId)
      console.log('Datos a enviar:', updateData)
      
      const response = await fetch(`${API_BASE_URL}/equipo-pokemon/${pokemonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()
      console.log('Respuesta Update:', result)
      
      return {
        success: response.ok,
        data: result,
        message: result.message || 'Pokémon actualizado'
      }
    } catch (error) {
      console.error('Error actualizando Pokémon:', error)
      return {
        success: false,
        message: error.message || 'Error al actualizar Pokémon'
      }
    }
  },

  // Calcular estadísticas finales basadas en base stats, IVs, EVs y naturaleza
  calculateFinalStats(baseStats, ivs, evs, level = 50, nature) {
    const calculateStat = (base, iv, ev, level, isHP = false, natureMod = 1.0) => {
      if (isHP) {
        return Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + level + 10
      } else {
        return Math.floor((Math.floor(((base * 2 + iv + Math.floor(ev / 4)) * level) / 100) + 5) * natureMod)
      }
    }

    // Obtener modificadores de naturaleza
    const getNatureModifiers = (natureName) => {
      const natures = {
        'Hardy': { up: null, down: null },
        'Adamant': { up: 'ataque', down: 'sp_ataque' },
        'Bold': { up: 'defensa', down: 'ataque' },
        'Brave': { up: 'ataque', down: 'velocidad' },
        'Calm': { up: 'sp_defensa', down: 'ataque' },
        'Careful': { up: 'sp_defensa', down: 'sp_ataque' },
        'Gentle': { up: 'sp_defensa', down: 'defensa' },
        'Hasty': { up: 'velocidad', down: 'defensa' },
        'Impish': { up: 'defensa', down: 'sp_ataque' },
        'Jolly': { up: 'velocidad', down: 'sp_ataque' },
        'Lax': { up: 'defensa', down: 'sp_defensa' },
        'Lonely': { up: 'ataque', down: 'defensa' },
        'Mild': { up: 'sp_ataque', down: 'defensa' },
        'Modest': { up: 'sp_ataque', down: 'ataque' },
        'Naive': { up: 'velocidad', down: 'sp_defensa' },
        'Naughty': { up: 'ataque', down: 'sp_defensa' },
        'Quiet': { up: 'sp_ataque', down: 'velocidad' },
        'Rash': { up: 'sp_ataque', down: 'sp_defensa' },
        'Relaxed': { up: 'defensa', down: 'velocidad' },
        'Sassy': { up: 'sp_defensa', down: 'velocidad' },
        'Timid': { up: 'velocidad', down: 'ataque' }
      }
      return natures[natureName] || { up: null, down: null }
    }

    const natureModifiers = getNatureModifiers(nature)
    
    const getStatModifier = (stat) => {
      if (natureModifiers.up === stat) return 1.1
      if (natureModifiers.down === stat) return 0.9
      return 1.0
    }

    return {
      HP: calculateStat(baseStats.HP, ivs.HP, evs.HP, level, true),
      ataque: calculateStat(baseStats.ataque, ivs.ataque, evs.ataque, level, false, getStatModifier('ataque')),
      defensa: calculateStat(baseStats.defensa, ivs.defensa, evs.defensa, level, false, getStatModifier('defensa')),
      sp_ataque: calculateStat(baseStats.sp_ataque, ivs.sp_ataque, evs.sp_ataque, level, false, getStatModifier('sp_ataque')),
      sp_defensa: calculateStat(baseStats.sp_defensa, ivs.sp_defensa, evs.sp_defensa, level, false, getStatModifier('sp_defensa')),
      velocidad: calculateStat(baseStats.velocidad, ivs.velocidad, evs.velocidad, level, false, getStatModifier('velocidad'))
    }
  },

  // Obtener datos de naturaleza por nombre
  getNatureData(natureName) {
    const naturesData = {
      'Hardy': { stat_sube: null, stat_baja: null, descripcion: 'Neutral' },
      'Adamant': { stat_sube: 'ataque', stat_baja: 'sp_ataque', descripcion: 'Aumenta Ataque, disminuye Ataque Especial' },
      'Bold': { stat_sube: 'defensa', stat_baja: 'ataque', descripcion: 'Aumenta Defensa, disminuye Ataque' },
      'Brave': { stat_sube: 'ataque', stat_baja: 'velocidad', descripcion: 'Aumenta Ataque, disminuye Velocidad' },
      'Calm': { stat_sube: 'sp_defensa', stat_baja: 'ataque', descripcion: 'Aumenta Defensa Especial, disminuye Ataque' },
      'Careful': { stat_sube: 'sp_defensa', stat_baja: 'sp_ataque', descripcion: 'Aumenta Defensa Especial, disminuye Ataque Especial' },
      'Gentle': { stat_sube: 'sp_defensa', stat_baja: 'defensa', descripcion: 'Aumenta Defensa Especial, disminuye Defensa' },
      'Hasty': { stat_sube: 'velocidad', stat_baja: 'defensa', descripcion: 'Aumenta Velocidad, disminuye Defensa' },
      'Impish': { stat_sube: 'defensa', stat_baja: 'sp_ataque', descripcion: 'Aumenta Defensa, disminuye Ataque Especial' },
      'Jolly': { stat_sube: 'velocidad', stat_baja: 'sp_ataque', descripcion: 'Aumenta Velocidad, disminuye Ataque Especial' },
      'Lax': { stat_sube: 'defensa', stat_baja: 'sp_defensa', descripcion: 'Aumenta Defensa, disminuye Defensa Especial' },
      'Lonely': { stat_sube: 'ataque', stat_baja: 'defensa', descripcion: 'Aumenta Ataque, disminuye Defensa' },
      'Mild': { stat_sube: 'sp_ataque', stat_baja: 'defensa', descripcion: 'Aumenta Ataque Especial, disminuye Defensa' },
      'Modest': { stat_sube: 'sp_ataque', stat_baja: 'ataque', descripcion: 'Aumenta Ataque Especial, disminuye Ataque' },
      'Naive': { stat_sube: 'velocidad', stat_baja: 'sp_defensa', descripcion: 'Aumenta Velocidad, disminuye Defensa Especial' },
      'Naughty': { stat_sube: 'ataque', stat_baja: 'sp_defensa', descripcion: 'Aumenta Ataque, disminuye Defensa Especial' },
      'Quiet': { stat_sube: 'sp_ataque', stat_baja: 'velocidad', descripcion: 'Aumenta Ataque Especial, disminuye Velocidad' },
      'Rash': { stat_sube: 'sp_ataque', stat_baja: 'sp_defensa', descripcion: 'Aumenta Ataque Especial, disminuye Defensa Especial' },
      'Relaxed': { stat_sube: 'defensa', stat_baja: 'velocidad', descripcion: 'Aumenta Defensa, disminuye Velocidad' },
      'Sassy': { stat_sube: 'sp_defensa', stat_baja: 'velocidad', descripcion: 'Aumenta Defensa Especial, disminuye Velocidad' },
      'Timid': { stat_sube: 'velocidad', stat_baja: 'ataque', descripcion: 'Aumenta Velocidad, disminuye Ataque' }
    }
    
    return naturesData[natureName] || naturesData['Hardy']
  }
}

export { estadisticasService }
