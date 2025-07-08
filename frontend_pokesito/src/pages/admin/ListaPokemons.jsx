import React, { useState, useEffect, useCallback } from 'react'
import { pokemonService } from '../../services/pokemonService'
import { habilidadesService } from '../../services/habilidades'
import { movimientosService } from '../../services/movimientos'
import { tipoService } from '../../services/tipoService'
import '../../styles/ListaPokemons.css'

function ListaPokemons() {
  const [_pokemons, setPokemons] = useState([])
  const [pokemonsWithDetails, setPokemonsWithDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Estados para los datos disponibles
  const [habilidades, setHabilidades] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [tipos, setTipos] = useState([])

  // Estados para el formulario de edición
  const [editForm, setEditForm] = useState({
    nombre_pok: '',
    HP: '',
    ataque: '',
    defensa: '',
    sp_ataque: '',
    sp_defensa: '',
    velocidad: '',
    image: null
  })

  // Estados para las relaciones en edición
  const [selectedHabilidades, setSelectedHabilidades] = useState([])
  const [selectedMovimientos, setSelectedMovimientos] = useState([])
  const [selectedTipos, setSelectedTipos] = useState([])

  // Estados para relaciones existentes (para debug y futuras funcionalidades)
  const [_currentHabilidades, setCurrentHabilidades] = useState([])
  const [_currentMovimientos, setCurrentMovimientos] = useState([])
  const [_currentTipos, setCurrentTipos] = useState([])

  const [loadingRelations, setLoadingRelations] = useState(false)

  // Cargar Pokémon y datos iniciales al montar el componente
  useEffect(() => {
    const loadData = async () => {
      await loadPokemons()
      await loadInitialData()
    }
    loadData()
  }, [])

  // Cargar datos disponibles (habilidades, movimientos, tipos)
  const loadInitialData = async () => {
    try {
      const [habilidadesResult, movimientosResult, tiposResult] = await Promise.all([
        habilidadesService.getAllHabilidades(),
        movimientosService.getAllMovimientos(),
        tipoService.getAllTipos()
      ])

      if (habilidadesResult.success) {
        const habilidadesData = habilidadesResult.data || []
        setHabilidades(Array.isArray(habilidadesData) ? habilidadesData : [])
      }

      if (movimientosResult.success) {
        const movimientosData = movimientosResult.data || []
        setMovimientos(Array.isArray(movimientosData) ? movimientosData : [])
      }

      if (tiposResult.success) {
        const tiposData = tiposResult.data || []
        setTipos(Array.isArray(tiposData) ? tiposData : [])
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error)
    }
  }

  const loadPokemons = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔍 ListaPokemons - Cargando Pokémon...')
      
      const response = await pokemonService.getAllPokemon()
      console.log('✅ ListaPokemons - Respuesta de Pokémon:', response)
      
      if (response.success) {
        let pokemonsData = response.data
        
        // Verificar si response.data es un array o si está dentro de una propiedad
        if (!Array.isArray(pokemonsData)) {
          console.log('❓ response.data no es array, buscando Pokémon en propiedades...')
          pokemonsData = response.data.pokemon || 
                        response.data.datos || 
                        response.data.data || 
                        []
          console.log('✅ Pokémon encontrados en:', pokemonsData)
        }
        
        if (Array.isArray(pokemonsData)) {
          setPokemons(pokemonsData)
          console.log(`✅ ${pokemonsData.length} Pokémon cargados`)
          
          // Cargar detalles de habilidades y movimientos para cada Pokémon
          await loadPokemonsWithDetails(pokemonsData)
        } else {
          console.error('❌ Los datos de Pokémon no son un array:', pokemonsData)
          setError('Los datos de Pokémon no tienen el formato esperado')
        }
      } else {
        setError(response.message || 'Error al cargar Pokémon')
      }
    } catch (error) {
      console.error('❌ Error al cargar Pokémon:', error)
      setError('Error al cargar Pokémon')
    } finally {
      setLoading(false)
    }
  }

  // Cargar detalles de habilidades y movimientos para mostrar en la lista
  const loadPokemonsWithDetails = async (pokemonList) => {
    try {
      const pokemonsWithDetails = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const pokemonId = pokemon.id_pokemon || pokemon.id
          
          try {
            const [movimientosResult, habilidadesResult] = await Promise.all([
              fetch(`http://localhost:3001/api/pokemon/${pokemonId}/movimientos`).then(res => res.json()),
              fetch(`http://localhost:3001/api/pokemon/${pokemonId}/habilidades`).then(res => res.json())
            ])

            const movimientos = movimientosResult.exito ? 
              (movimientosResult.datos?.movimientos || []) : []
            
            const habilidades = habilidadesResult.exito ? 
              (habilidadesResult.datos?.habilidades || []) : []

            return {
              ...pokemon,
              movimientos,
              habilidades
            }
          } catch (error) {
            console.warn(`Error cargando detalles para Pokémon ${pokemonId}:`, error)
            return {
              ...pokemon,
              movimientos: [],
              habilidades: []
            }
          }
        })
      )
      
      setPokemonsWithDetails(pokemonsWithDetails)
      console.log('✅ Pokémon con detalles cargados:', pokemonsWithDetails)
    } catch (error) {
      console.error('❌ Error al cargar detalles de Pokémon:', error)
      setPokemonsWithDetails(pokemonList.map(p => ({ ...p, movimientos: [], habilidades: [] })))
    }
  }

  // Cargar relaciones existentes de un Pokémon
  const loadPokemonRelations = async (pokemonId) => {
    setLoadingRelations(true)
    try {
      console.log('🔍 Cargando relaciones para Pokémon:', pokemonId)
      
      const [movimientosResult, habilidadesResult, tiposResult] = await Promise.all([
        pokemonService.getPokemonMovimientos(pokemonId),
        pokemonService.getPokemonHabilidades(pokemonId),
        pokemonService.getPokemonTipos(pokemonId)
      ])

      // Cargar movimientos
      if (movimientosResult.success) {
        const movimientosData = movimientosResult.data || []
        console.log('📋 Movimientos cargados:', movimientosData)
        
        // Verificar si los datos están anidados
        let movimientos = []
        if (movimientosData.movimientos && Array.isArray(movimientosData.movimientos)) {
          movimientos = movimientosData.movimientos
        } else if (Array.isArray(movimientosData)) {
          movimientos = movimientosData
        }
        
        setCurrentMovimientos(movimientos)
        setSelectedMovimientos(movimientos.map(mov => mov.id_movimiento || mov.Movimiento?.id_movimiento))
      } else {
        setCurrentMovimientos([])
        setSelectedMovimientos([])
      }

      // Cargar habilidades
      if (habilidadesResult.success) {
        const habilidadesData = habilidadesResult.data || []
        console.log('📋 Habilidades cargadas:', habilidadesData)
        
        // Verificar si los datos están anidados
        let habilidades = []
        if (habilidadesData.habilidades && Array.isArray(habilidadesData.habilidades)) {
          habilidades = habilidadesData.habilidades
        } else if (Array.isArray(habilidadesData)) {
          habilidades = habilidadesData
        }
        
        setCurrentHabilidades(habilidades)
        setSelectedHabilidades(habilidades.map(hab => ({
          id: hab.id_habilidad || hab.Habilidad?.id_habilidad,
          tipo: hab.tipo || 'normal'
        })))
      } else {
        setCurrentHabilidades([])
        setSelectedHabilidades([])
      }

      // Cargar tipos
      if (tiposResult.success) {
        const tiposData = tiposResult.data || []
        console.log('📋 Tipos cargados:', tiposData)
        
        // Verificar si los datos están anidados
        let tipos = []
        if (tiposData.tipos && Array.isArray(tiposData.tipos)) {
          tipos = tiposData.tipos
        } else if (Array.isArray(tiposData)) {
          tipos = tiposData
        }
        
        setCurrentTipos(tipos)
        setSelectedTipos(tipos.map(tipo => tipo.id_tipo || tipo.Tipo?.id_tipo))
      } else {
        setCurrentTipos([])
        setSelectedTipos([])
      }

      console.log('✅ Relaciones cargadas:', {
        movimientos: movimientosResult.data,
        habilidades: habilidadesResult.data,
        tipos: tiposResult.data
      })
    } catch (error) {
      console.error('❌ Error al cargar relaciones:', error)
      setCurrentMovimientos([])
      setCurrentHabilidades([])
      setCurrentTipos([])
      setSelectedMovimientos([])
      setSelectedHabilidades([])
      setSelectedTipos([])
    } finally {
      setLoadingRelations(false)
    }
  }

  // Función para obtener la URL correcta de la imagen (copiada de TeamBuilder)
  const getImageUrl = (pokemon) => {
    if (!pokemon) {
      return '/pokemon-placeholder.svg'
    }
    
    // Si tiene img_pok y NO es el placeholder, usarlo
    if (pokemon.img_pok && pokemon.img_pok !== '/pokemon-placeholder.svg') {
      // Si ya es una URL completa, usarla tal como está
      if (pokemon.img_pok.startsWith('http')) {
        return pokemon.img_pok
      }
      // Si es una ruta relativa, construir la URL completa
      const fullUrl = `http://localhost:3001/${pokemon.img_pok}`
      return fullUrl
    }
    
    // Si tiene path, construir la URL completa
    if (pokemon.path) {
      const fullUrl = `http://localhost:3001/${pokemon.path}`
      return fullUrl
    }
    
    // Si tiene imagen, construir la URL completa
    if (pokemon.imagen) {
      if (pokemon.imagen.startsWith('http')) {
        return pokemon.imagen
      }
      const fullUrl = `http://localhost:3001/${pokemon.imagen}`
      return fullUrl
    }
    
    // Si tiene image, construir la URL completa
    if (pokemon.image) {
      if (pokemon.image.startsWith('http')) {
        return pokemon.image
      }
      const fullUrl = `http://localhost:3001/${pokemon.image}`
      return fullUrl
    }
    
    // Si llegamos aquí, usar placeholder
    return '/pokemon-placeholder.svg'
  }

  // Filtrar Pokémon por nombre
  const filteredPokemons = pokemonsWithDetails.filter(pokemon =>
    pokemon.nombre_pok?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Abrir modal de edición
  const handleEdit = async (pokemon) => {
    console.log('📝 Editando Pokémon:', pokemon)
    setSelectedPokemon(pokemon)
    setEditForm({
      nombre_pok: pokemon.nombre_pok || '',
      HP: pokemon.HP || '',
      ataque: pokemon.ataque || '',
      defensa: pokemon.defensa || '',
      sp_ataque: pokemon.sp_ataque || '',
      sp_defensa: pokemon.sp_defensa || '',
      velocidad: pokemon.velocidad || '',
      image: null
    })
    setShowEditModal(true)
    
    // Cargar relaciones existentes
    const pokemonId = pokemon.id_pokemon || pokemon.id
    if (pokemonId) {
      await loadPokemonRelations(pokemonId)
    }
  }

  // Cerrar modal de edición
  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedPokemon(null)
    setEditForm({
      nombre_pok: '',
      HP: '',
      ataque: '',
      defensa: '',
      sp_ataque: '',
      sp_defensa: '',
      velocidad: '',
      image: null
    })
    // Resetear estados de relaciones
    setSelectedHabilidades([])
    setSelectedMovimientos([])
    setSelectedTipos([])
    setCurrentHabilidades([])
    setCurrentMovimientos([])
    setCurrentTipos([])
  }

  // Manejar cambios en el formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      setEditForm(prev => ({
        ...prev,
        [name]: files[0] || null
      }))
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Manejar selección de habilidades
  const handleHabilidadChange = (habilidadId, tipo) => {
    setSelectedHabilidades(prev => {
      const existingIndex = prev.findIndex(h => h.id === habilidadId)
      if (existingIndex >= 0) {
        // Actualizar tipo existente
        const newHabilidades = [...prev]
        newHabilidades[existingIndex] = { id: habilidadId, tipo }
        return newHabilidades
      } else {
        // Agregar nueva habilidad
        return [...prev, { id: habilidadId, tipo }]
      }
    })
  }

  // Remover habilidad
  const handleRemoveHabilidad = (habilidadId) => {
    setSelectedHabilidades(prev => prev.filter(h => h.id !== habilidadId))
  }

  // Manejar selección de movimientos
  const handleMovimientoToggle = (movimientoId) => {
    setSelectedMovimientos(prev => {
      if (prev.includes(movimientoId)) {
        return prev.filter(id => id !== movimientoId)
      } else {
        return [...prev, movimientoId]
      }
    })
  }

  // Manejar selección de tipos
  const handleTipoToggle = (tipoId) => {
    setSelectedTipos(prev => {
      if (prev.includes(tipoId)) {
        return prev.filter(id => id !== tipoId)
      } else {
        return [...prev, tipoId]
      }
    })
  }

  // Guardar relaciones
  const saveRelations = async (pokemonId) => {
    console.log('💾 Guardando relaciones para Pokémon:', pokemonId)
    
    try {
      // Primero eliminar relaciones existentes
      await pokemonService.deletePokemonRelations(pokemonId)
      console.log('🗑️ Relaciones existentes eliminadas')
      
      // Guardar movimientos
      if (selectedMovimientos.length > 0) {
        const movimientosPromises = selectedMovimientos.map(movimientoId => 
          pokemonService.addPokemonMovimiento(pokemonId, movimientoId)
        )
        await Promise.all(movimientosPromises)
        console.log('✅ Movimientos guardados')
      }

      // Guardar habilidades
      if (selectedHabilidades.length > 0) {
        const habilidadesPromises = selectedHabilidades
          .filter(habilidad => habilidad.id) // Solo habilidades con ID válido
          .map(habilidad => 
            pokemonService.addPokemonHabilidad(pokemonId, habilidad.id, habilidad.tipo)
          )
        await Promise.all(habilidadesPromises)
        console.log('✅ Habilidades guardadas')
      }

      // Guardar tipos
      if (selectedTipos.length > 0) {
        const tiposPromises = selectedTipos.map(tipoId => 
          pokemonService.addPokemonTipo(pokemonId, tipoId)
        )
        await Promise.all(tiposPromises)
        console.log('✅ Tipos guardados')
      }

    } catch (error) {
      console.error('❌ Error al guardar relaciones:', error)
      throw error
    }
  }

  // Guardar cambios
  const handleSaveEdit = async () => {
    try {
      if (!selectedPokemon) return

      console.log('💾 Guardando cambios para Pokémon:', selectedPokemon.id_pokemon)
      console.log('📝 Datos del formulario:', editForm)

      const pokemonId = selectedPokemon.id_pokemon || selectedPokemon.id
      
      // Actualizar datos básicos del Pokémon
      const response = await pokemonService.updatePokemon(pokemonId, editForm)

      if (response.success) {
        console.log('✅ Pokémon actualizado exitosamente')
        
        // Guardar relaciones
        await saveRelations(pokemonId)
        
        alert('Pokémon actualizado exitosamente')
        handleCloseEditModal()
        loadPokemons() // Recargar la lista
      } else {
        console.error('❌ Error al actualizar Pokémon:', response.message)
        alert(`Error al actualizar Pokémon: ${response.message}`)
      }
    } catch (error) {
      console.error('❌ Error al actualizar Pokémon:', error)
      alert('Error al actualizar Pokémon')
    }
  }

  // Abrir modal de eliminación
  const handleDelete = (pokemon) => {
    console.log('🗑️ Solicitando eliminación de Pokémon:', pokemon)
    setSelectedPokemon(pokemon)
    setShowDeleteModal(true)
  }

  // Cerrar modal de eliminación
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedPokemon(null)
  }

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    try {
      if (!selectedPokemon) return

      console.log('🗑️ Eliminando Pokémon:', selectedPokemon.id_pokemon)

      const pokemonId = selectedPokemon.id_pokemon || selectedPokemon.id
      const response = await pokemonService.deletePokemon(pokemonId)

      if (response.success) {
        console.log('✅ Pokémon eliminado exitosamente')
        alert('Pokémon eliminado exitosamente')
        handleCloseDeleteModal()
        loadPokemons() // Recargar la lista
      } else {
        console.error('❌ Error al eliminar Pokémon:', response.message)
        alert(`Error al eliminar Pokémon: ${response.message}`)
      }
    } catch (error) {
      console.error('❌ Error al eliminar Pokémon:', error)
      alert('Error al eliminar Pokémon')
    }
  }

  if (loading) {
    return (
      <div className="lista-pokemons-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando Pokémon...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="lista-pokemons-container">
      <div className="lista-pokemons-header">
        <h2>Lista de Pokémon</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Pokémon por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="pokemons-grid">
        {filteredPokemons.length > 0 ? (
          filteredPokemons.map((pokemon) => (
            <div key={pokemon.id_pokemon || pokemon.id} className="pokemon-card">
              <div className="pokemon-image">
                <img 
                  src={getImageUrl(pokemon)} 
                  alt={pokemon.nombre_pok}
                  onError={(e) => {
                    e.target.src = '/pokemon-placeholder.svg'
                  }}
                />
              </div>
              
              <div className="pokemon-info">
                <h3>{pokemon.nombre_pok}</h3>
                <div className="pokemon-stats">
                  <div className="stat-item">
                    <span className="stat-label">HP:</span>
                    <span className="stat-value">{pokemon.HP}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ataque:</span>
                    <span className="stat-value">{pokemon.ataque}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Defensa:</span>
                    <span className="stat-value">{pokemon.defensa}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sp. Ataque:</span>
                    <span className="stat-value">{pokemon.sp_ataque}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sp. Defensa:</span>
                    <span className="stat-value">{pokemon.sp_defensa}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Velocidad:</span>
                    <span className="stat-value">{pokemon.velocidad}</span>
                  </div>
                </div>

                {/* Sección de Habilidades */}
                {pokemon.habilidades && pokemon.habilidades.length > 0 && (
                  <div className="pokemon-abilities">
                    <h4>Habilidades:</h4>
                    <div className="abilities-list">
                      {pokemon.habilidades.map((hab, index) => (
                        <span key={index} className={`ability-tag ${hab.tipo}`}>
                          {hab.Habilidad?.nombre || 'Habilidad'}
                          {hab.tipo === 'oculta' && ' (Oculta)'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sección de Movimientos */}
                {pokemon.movimientos && pokemon.movimientos.length > 0 && (
                  <div className="pokemon-moves">
                    <h4>Movimientos:</h4>
                    <div className="moves-list">
                      {pokemon.movimientos.slice(0, 4).map((mov, index) => (
                        <span key={index} className="move-tag">
                          {mov.Movimiento?.nombre || 'Movimiento'}
                          {mov.Movimiento?.poder && ` (${mov.Movimiento.poder})`}
                        </span>
                      ))}
                      {pokemon.movimientos.length > 4 && (
                        <span className="more-moves">+{pokemon.movimientos.length - 4} más</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pokemon-actions">
                <button 
                  onClick={() => handleEdit(pokemon)}
                  className="btn btn-edit"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(pokemon)}
                  className="btn btn-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-pokemons">
            {searchTerm ? 
              `No se encontraron Pokémon con el nombre "${searchTerm}"` : 
              'No hay Pokémon disponibles'
            }
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar Pokémon</h3>
              <button 
                onClick={handleCloseEditModal}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              {loadingRelations && (
                <div className="loading-relations">
                  <p>Cargando relaciones...</p>
                </div>
              )}
              
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre_pok"
                  value={editForm.nombre_pok}
                  onChange={handleEditFormChange}
                  className="form-input"
                />
              </div>
              
              <div className="stats-grid">
                <div className="form-group">
                  <label>HP:</label>
                  <input
                    type="number"
                    name="HP"
                    value={editForm.HP}
                    onChange={handleEditFormChange}
                    className="form-input"
                    min="1"
                    max="255"
                  />
                </div>
                
                <div className="form-group">
                  <label>Ataque:</label>
                  <input
                    type="number"
                    name="ataque"
                    value={editForm.ataque}
                    onChange={handleEditFormChange}
                    className="form-input"
                    min="1"
                    max="255"
                  />
                </div>
                
                <div className="form-group">
                  <label>Defensa:</label>
                  <input
                    type="number"
                    name="defensa"
                    value={editForm.defensa}
                    onChange={handleEditFormChange}
                    className="form-input"
                    min="1"
                    max="255"
                  />
                </div>
                
                <div className="form-group">
                  <label>Sp. Ataque:</label>
                  <input
                    type="number"
                    name="sp_ataque"
                    value={editForm.sp_ataque}
                    onChange={handleEditFormChange}
                    className="form-input"
                    min="1"
                    max="255"
                  />
                </div>
                
                <div className="form-group">
                  <label>Sp. Defensa:</label>
                  <input
                    type="number"
                    name="sp_defensa"
                    value={editForm.sp_defensa}
                    onChange={handleEditFormChange}
                    className="form-input"
                    min="1"
                    max="255"
                  />
                </div>
                
                <div className="form-group">
                  <label>Velocidad:</label>
                  <input
                    type="number"
                    name="velocidad"
                    value={editForm.velocidad}
                    onChange={handleEditFormChange}
                    className="form-input"
                    min="1"
                    max="255"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Imagen:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleEditFormChange}
                  className="form-input"
                />
              </div>

              {/* Sección de Tipos */}
              <div className="form-group">
                <label>Tipos:</label>
                <div className="checkbox-grid">
                  {tipos.map(tipo => (
                    <div key={tipo.id_tipo || tipo.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`tipo-${tipo.id_tipo || tipo.id}`}
                        checked={selectedTipos.includes(tipo.id_tipo || tipo.id)}
                        onChange={() => handleTipoToggle(tipo.id_tipo || tipo.id)}
                      />
                      <label htmlFor={`tipo-${tipo.id_tipo || tipo.id}`}>
                        {tipo.nombre_tipo || tipo.nombre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección de Habilidades */}
              <div className="form-group">
                <label>Habilidades:</label>
                <div className="habilidades-container">
                  {selectedHabilidades.map((habilidad, index) => {
                    return (
                      <div key={index} className="habilidad-item">
                        <select
                          value={habilidad.id}
                          onChange={(e) => handleHabilidadChange(parseInt(e.target.value), habilidad.tipo)}
                          className="form-select"
                        >
                          <option value="">Seleccionar habilidad</option>
                          {habilidades.map(hab => (
                            <option key={hab.id_habilidad || hab.id} value={hab.id_habilidad || hab.id}>
                              {hab.nombre_habilidad || hab.nombre}
                            </option>
                          ))}
                        </select>
                        <select
                          value={habilidad.tipo}
                          onChange={(e) => handleHabilidadChange(habilidad.id, e.target.value)}
                          className="form-select"
                        >
                          <option value="normal">Normal</option>
                          <option value="oculta">Oculta</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveHabilidad(habilidad.id)}
                          className="btn btn-remove"
                        >
                          Eliminar
                        </button>
                      </div>
                    )
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedHabilidades([...selectedHabilidades, { id: '', tipo: 'normal' }])}
                    className="btn btn-add"
                  >
                    Agregar Habilidad
                  </button>
                </div>
              </div>

              {/* Sección de Movimientos */}
              <div className="form-group">
                <label>Movimientos:</label>
                <div className="movimientos-container">
                  <div className="checkbox-grid">
                    {movimientos.map(movimiento => (
                      <div key={movimiento.id_movimiento || movimiento.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          id={`movimiento-${movimiento.id_movimiento || movimiento.id}`}
                          checked={selectedMovimientos.includes(movimiento.id_movimiento || movimiento.id)}
                          onChange={() => handleMovimientoToggle(movimiento.id_movimiento || movimiento.id)}
                        />
                        <label htmlFor={`movimiento-${movimiento.id_movimiento || movimiento.id}`}>
                          {movimiento.nombre_movimiento || movimiento.nombre}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleCloseEditModal}
                className="btn btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="btn btn-save"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
              <button 
                onClick={handleCloseDeleteModal}
                className="close-button"
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <p>¿Estás seguro de que quieres eliminar el Pokémon <strong>{selectedPokemon?.nombre_pok}</strong>?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            
            <div className="modal-footer">
              <button 
                onClick={handleCloseDeleteModal}
                className="btn btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="btn btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListaPokemons
