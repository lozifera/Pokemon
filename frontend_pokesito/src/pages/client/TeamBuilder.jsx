import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { equiposService, equipoPokemonService } from '../../services/equiposService'
import { pokemonService } from '../../services/pokemonService'
import { userUtils } from '../../utils/userUtils'
import '../../styles/TeamBuilder.css'

const TeamBuilder = () => {
  const { user } = useAuth()
  const [equipos, setEquipos] = useState([])
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [equipoPokemon, setEquipoPokemon] = useState([])
  const [pokemonDisponibles, setPokemonDisponibles] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showPokemonSelector, setShowPokemonSelector] = useState(false)
  const [showPokemonEditor, setShowPokemonEditor] = useState(false)
  const [selectedPokemonForEdit, setSelectedPokemonForEdit] = useState(null)
  const [nuevoEquipoNombre, setNuevoEquipoNombre] = useState('')

  // Estados para el editor de Pokémon
  const [pokemonEditData, setPokemonEditData] = useState({
    apodo_pok: '',
    nivel: 50,
    experiencia: 0,
    // IVs (Individual Values)
    iv_hp: 31,
    iv_ataque: 31,
    iv_defensa: 31,
    iv_ataque_especial: 31,
    iv_defensa_especial: 31,
    iv_velocidad: 31,
    // EVs (Effort Values)
    ev_hp: 0,
    ev_ataque: 0,
    ev_defensa: 0,
    ev_ataque_especial: 0,
    ev_defensa_especial: 0,
    ev_velocidad: 0,
    // Otros campos
    naturaleza: 'Hardy',
    id_habilidad: null,
    id_articulo: null
  })

  // Debug: Mostrar información del usuario
  useEffect(() => {
    console.log('TeamBuilder - Usuario actual:', user)
    console.log('TeamBuilder - ID de usuario:', user?.id_usuario || user?.id)
    console.log('TeamBuilder - Nombre de usuario:', user?.nombre_usuario || user?.nombre)
    console.log('TeamBuilder - Debug completo:', userUtils.getUserDebugInfo())
  }, [user])

  // Cargar equipos del usuario al montar el componente
  useEffect(() => {
    loadUserEquipos()
    loadPokemonDisponibles()
  }, [])

  // Cargar Pokémon del equipo cuando se selecciona un equipo
  useEffect(() => {
    if (selectedEquipo) {
      loadEquipoPokemon(selectedEquipo.id_equipo)
    }
  }, [selectedEquipo])

  const loadUserEquipos = async () => {
    setLoading(true)
    try {
      const result = await equiposService.getUserEquipos()
      if (result.success) {
        setEquipos(Array.isArray(result.data) ? result.data : [])
      } else {
        console.error('Error al cargar equipos:', result.message)
        setEquipos([])
      }
    } catch (error) {
      console.error('Error:', error)
      setEquipos([])
    } finally {
      setLoading(false)
    }
  }

  const loadEquipoPokemon = async (equipoId) => {
    try {
      const result = await equipoPokemonService.getEquipoPokemon(equipoId)
      if (result.success) {
        setEquipoPokemon(Array.isArray(result.data) ? result.data : [])
      } else {
        console.error('Error al cargar Pokémon del equipo:', result.message)
        setEquipoPokemon([])
      }
    } catch (error) {
      console.error('Error:', error)
      setEquipoPokemon([])
    }
  }

  const loadPokemonDisponibles = async () => {
    try {
      const result = await pokemonService.getAllPokemon()
      if (result.success) {
        setPokemonDisponibles(Array.isArray(result.data) ? result.data : [])
      } else {
        console.error('Error al cargar Pokémon disponibles:', result.message)
        setPokemonDisponibles([])
      }
    } catch (error) {
      console.error('Error:', error)
      setPokemonDisponibles([])
    }
  }

  // Función para obtener la URL correcta de la imagen
  const getImageUrl = (pokemon) => {
    // Verificar diferentes posibles campos de imagen
    const imageField = pokemon.img_pok || pokemon.imagen || pokemon.image
    
    if (!imageField) {
      return '/pokemon-placeholder.svg'
    }

    // Si es una URL completa, devolverla tal como está
    if (imageField.startsWith('http')) {
      return imageField
    }

    // Si es solo un nombre de archivo, construir la URL del backend
    if (!imageField.startsWith('/')) {
      return `http://localhost:3001/uploads/pokemon/${imageField}`
    }

    // Si ya es una ruta, devolverla tal como está
    return imageField
  }

  // Función para abrir el editor de Pokémon
  const openPokemonEditor = (pokemon) => {
    setSelectedPokemonForEdit(pokemon)
    setPokemonEditData({
      apodo_pok: pokemon.apodo_pok || pokemon.nombre_pok,
      nivel: pokemon.nivel || 50,
      experiencia: pokemon.experiencia || 0,
      // IVs
      iv_hp: pokemon.iv_hp || 31,
      iv_ataque: pokemon.iv_ataque || 31,
      iv_defensa: pokemon.iv_defensa || 31,
      iv_ataque_especial: pokemon.iv_ataque_especial || 31,
      iv_defensa_especial: pokemon.iv_defensa_especial || 31,
      iv_velocidad: pokemon.iv_velocidad || 31,
      // EVs
      ev_hp: pokemon.ev_hp || 0,
      ev_ataque: pokemon.ev_ataque || 0,
      ev_defensa: pokemon.ev_defensa || 0,
      ev_ataque_especial: pokemon.ev_ataque_especial || 0,
      ev_defensa_especial: pokemon.ev_defensa_especial || 0,
      ev_velocidad: pokemon.ev_velocidad || 0,
      // Otros
      naturaleza: pokemon.naturaleza || 'Hardy',
      id_habilidad: pokemon.id_habilidad || null,
      id_articulo: pokemon.id_articulo || null
    })
    setShowPokemonEditor(true)
  }

  // Función para guardar los cambios del Pokémon editado
  const savePokemonEdit = async () => {
    if (!selectedPokemonForEdit) return

    try {
      const updateData = {
        ...pokemonEditData,
        id_equipo: selectedEquipo.id_equipo,
        id_pokemon: selectedPokemonForEdit.id_pokemon,
        nombre_pok: selectedPokemonForEdit.nombre_pok,
        img_pok: getImageUrl(selectedPokemonForEdit)
      }

      console.log('Actualizando Pokémon:', updateData)
      
      const result = await equipoPokemonService.updatePokemonInEquipo(
        selectedPokemonForEdit.id_equipo_pokemon, 
        updateData
      )

      if (result.success) {
        alert('Pokémon actualizado exitosamente')
        setShowPokemonEditor(false)
        setSelectedPokemonForEdit(null)
        loadEquipoPokemon(selectedEquipo.id_equipo)
      } else {
        alert('Error al actualizar Pokémon: ' + result.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar Pokémon')
    }
  }
  const testEquipoPokemonEndpoint = async () => {
    console.log('=== PROBANDO ENDPOINT equipo-pokemon ===')
    
    if (!selectedEquipo) {
      console.log('Error: No hay equipo seleccionado')
      return
    }

    const testData = {
      id_equipo: selectedEquipo.id_equipo,
      id_pokemon: 1, // ID básico para prueba
      nombre_pok: 'Test Pokemon',
      apodo_pok: 'Test Pokemon',
      img_pok: '/pokemon-placeholder.svg',
      id_detalle: null,
      id_articulo: null,
      id_estadisticas: null,
      id_habilidad: null
    }

    try {
      console.log('Enviando datos de prueba:', testData)
      const result = await equipoPokemonService.addPokemonToEquipo(testData)
      console.log('Resultado de prueba:', result)
    } catch (error) {
      console.error('Error en prueba:', error)
    }
    
    console.log('=== FIN DE PRUEBA ===')
  }

  const handleCreateEquipo = async (e) => {
    e.preventDefault()
    if (!nuevoEquipoNombre.trim()) return

    // Validar que el usuario esté disponible
    if (!user || (!user.id_usuario && !user.id)) {
      alert('Error: Usuario no autenticado correctamente')
      console.error('Usuario no disponible:', user)
      console.error('Debug info:', userUtils.getUserDebugInfo())
      return
    }

    setLoading(true)
    try {
      const equipoData = {
        nombre: nuevoEquipoNombre.trim(),
        id_usuario: user.id_usuario || user.id  // Usar id_usuario si existe, sino usar id
      }
      
      console.log('Creando equipo con datos:', equipoData)
      const result = await equiposService.createEquipo(equipoData)

      if (result.success) {
        alert('Equipo creado exitosamente')
        setNuevoEquipoNombre('')
        setShowCreateForm(false)
        loadUserEquipos()
      } else {
        alert('Error al crear equipo: ' + result.message)
        console.error('Error del servidor:', result)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear equipo')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectEquipo = (equipo) => {
    setSelectedEquipo(equipo)
    setShowPokemonSelector(false)
  }

  const handleDeleteEquipo = async (equipoId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        const result = await equiposService.deleteEquipo(equipoId)
        if (result.success) {
          alert('Equipo eliminado exitosamente')
          if (selectedEquipo && selectedEquipo.id_equipo === equipoId) {
            setSelectedEquipo(null)
            setEquipoPokemon([])
          }
          loadUserEquipos()
        } else {
          alert('Error al eliminar equipo: ' + result.message)
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar equipo')
      }
    }
  }

  const handleAddPokemonToEquipo = async (pokemon) => {
    if (!selectedEquipo) {
      alert('Selecciona un equipo primero')
      return
    }

    if (equipoPokemon.length >= 6) {
      alert('Un equipo no puede tener más de 6 Pokémon')
      return
    }

    try {
      // Intentar diferentes estructuras de datos para ver cuál funciona
      const pokemonDataOptions = [
        // Opción 1: Estructura completa con campos null
        {
          id_equipo: selectedEquipo.id_equipo,
          nombre_pok: pokemon.nombre_pok,
          apodo_pok: pokemon.nombre_pok,
          img_pok: getImageUrl(pokemon),
          id_pokemon: pokemon.id_pokemon,
          id_detalle: null,
          id_articulo: null,
          id_estadisticas: null,
          id_habilidad: null
        },
        // Opción 2: Estructura mínima
        {
          id_equipo: selectedEquipo.id_equipo,
          id_pokemon: pokemon.id_pokemon,
          nombre_pok: pokemon.nombre_pok,
          apodo_pok: pokemon.nombre_pok
        },
        // Opción 3: Con campos requeridos típicos
        {
          id_equipo: selectedEquipo.id_equipo,
          id_pokemon: pokemon.id_pokemon,
          nombre_pok: pokemon.nombre_pok,
          apodo_pok: pokemon.nombre_pok,
          img_pok: getImageUrl(pokemon),
          nivel: 50, // Nivel por defecto
          experiencia: 0 // Experiencia por defecto
        }
      ]

      const pokemonData = pokemonDataOptions[0] // Empezar con la primera opción

      console.log('=== AGREGANDO POKÉMON AL EQUIPO ===')
      console.log('Pokémon seleccionado:', pokemon)
      console.log('Equipo seleccionado:', selectedEquipo)
      console.log('Datos a enviar:', pokemonData)
      console.log('====================================')

      const result = await equipoPokemonService.addPokemonToEquipo(pokemonData)
      
      console.log('=== RESULTADO DEL SERVIDOR ===')
      console.log('Result:', result)
      console.log('==============================')

      if (result.success) {
        alert('Pokémon agregado al equipo exitosamente')
        loadEquipoPokemon(selectedEquipo.id_equipo)
        setShowPokemonSelector(false)
      } else {
        alert('Error al agregar Pokémon: ' + result.message)
        console.error('Error detallado:', result)
        
        // Mostrar sugerencias de debug
        console.log('=== SUGERENCIAS DE DEBUG ===')
        console.log('1. Verificar que estos campos existen en la base de datos:')
        console.log('   - id_equipo:', selectedEquipo.id_equipo)
        console.log('   - id_pokemon:', pokemon.id_pokemon)
        console.log('2. Verificar que el endpoint /equipo-pokemon acepta POST')
        console.log('3. Verificar que el usuario tiene permisos para agregar Pokémon')
        console.log('4. Estructuras alternativas a probar:', pokemonDataOptions)
        console.log('============================')
      }
    } catch (error) {
      console.error('Error catch:', error)
      alert('Error al agregar Pokémon al equipo')
    }
  }

  const handleRemovePokemonFromEquipo = async (pokemonId) => {
    if (window.confirm('¿Estás seguro de que quieres quitar este Pokémon del equipo?')) {
      try {
        const result = await equipoPokemonService.removePokemonFromEquipo(pokemonId)
        if (result.success) {
          alert('Pokémon eliminado del equipo exitosamente')
          loadEquipoPokemon(selectedEquipo.id_equipo)
        } else {
          alert('Error al eliminar Pokémon: ' + result.message)
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar Pokémon del equipo')
      }
    }
  }

  return (
    <div className="team-builder-container">
      <div className="team-builder-header">
        <h2>🎮 Constructor de Equipos Pokémon</h2>
        <p>Crea y gestiona tus equipos competitivos</p>
        <div className="user-welcome" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
          <p>👋 Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong>!</p>
          <p>💡 Todos los usuarios pueden crear equipos y agregar Pokémon</p>
        </div>
      </div>

      <div className="team-builder-content">
        {/* Panel izquierdo - Lista de equipos */}
        <div className="teams-panel">
          <div className="teams-header">
            <h3>Mis Equipos</h3>
            <button 
              className="btn-create-team"
              onClick={() => setShowCreateForm(!showCreateForm)}
              disabled={loading}
            >
              + Nuevo Equipo
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateEquipo} className="create-team-form">
              <input
                type="text"
                placeholder="Nombre del equipo"
                value={nuevoEquipoNombre}
                onChange={(e) => setNuevoEquipoNombre(e.target.value)}
                disabled={loading}
                required
              />
              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setNuevoEquipoNombre('')
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="teams-list">
            {loading ? (
              <div className="loading">Cargando equipos...</div>
            ) : equipos.length === 0 ? (
              <div className="no-teams">
                <p>No tienes equipos creados</p>
                <p>¡Crea tu primer equipo!</p>
              </div>
            ) : (
              equipos.map(equipo => (
                <div 
                  key={equipo.id_equipo} 
                  className={`team-item ${selectedEquipo?.id_equipo === equipo.id_equipo ? 'selected' : ''}`}
                  onClick={() => handleSelectEquipo(equipo)}
                >
                  <div className="team-info">
                    <h4>{equipo.nombre}</h4>
                    <small>Creado: {new Date(equipo.fecha_creacion || Date.now()).toLocaleDateString()}</small>
                  </div>
                  <button
                    className="btn-delete-team"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteEquipo(equipo.id_equipo)
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho - Equipo seleccionado */}
        <div className="team-detail-panel">
          {!selectedEquipo ? (
            <div className="no-team-selected">
              <h3>Selecciona un equipo</h3>
              <p>Elige un equipo de la lista para ver y editar sus Pokémon</p>
              {/* Debug info */}
              <div className="debug-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                <p><strong>Usuario:</strong> {user?.nombre || 'No disponible'}</p>
                <p><strong>ID Usuario:</strong> {user?.id_usuario || user?.id || 'No disponible'}</p>
                <p><strong>Correo:</strong> {user?.correo || 'No disponible'}</p>
                <p><strong>Admin:</strong> {user?.admin ? 'Sí' : 'No'}</p>
                <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Presente' : 'No disponible'}</p>
                <p><strong>Válido:</strong> {userUtils.isUserValid(user) ? 'Sí' : 'No'}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="team-detail-header">
                <h3>{selectedEquipo.nombre}</h3>
                <div className="team-actions">
                  <button
                    className="btn-add-pokemon"
                    onClick={() => setShowPokemonSelector(!showPokemonSelector)}
                    disabled={equipoPokemon.length >= 6}
                  >
                    {equipoPokemon.length >= 6 ? 'Equipo Completo' : '+ Agregar Pokémon'}
                  </button>
                  <button
                    className="btn-test-endpoint"
                    onClick={testEquipoPokemonEndpoint}
                    style={{ 
                      marginLeft: '10px', 
                      padding: '8px 16px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🔧 Probar Endpoint
                  </button>
                </div>
              </div>

              {/* Pokémon Selector */}
              {showPokemonSelector && (
                <div className="pokemon-selector">
                  <h4>Selecciona un Pokémon</h4>
                  <div className="pokemon-grid">
                    {pokemonDisponibles.map(pokemon => (
                      <div 
                        key={pokemon.id_pokemon}
                        className="pokemon-card"
                        onClick={() => handleAddPokemonToEquipo(pokemon)}
                      >
                        <img 
                          src={getImageUrl(pokemon)} 
                          alt={pokemon.nombre_pok}
                          onError={(e) => {
                            console.log('Error cargando imagen:', getImageUrl(pokemon))
                            e.target.src = '/pokemon-placeholder.svg'
                          }}
                        />
                        <span>{pokemon.nombre_pok}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pokémon del equipo */}
              <div className="team-pokemon">
                <div className="pokemon-slots">
                  {[...Array(6)].map((_, index) => {
                    const pokemon = equipoPokemon[index]
                    return (
                      <div key={index} className="pokemon-slot">
                        {pokemon ? (
                          <div className="pokemon-in-team">
                            <img 
                              src={getImageUrl(pokemon)} 
                              alt={pokemon.nombre_pok}
                              onError={(e) => {
                                console.log('Error cargando imagen del equipo:', getImageUrl(pokemon))
                                e.target.src = '/pokemon-placeholder.svg'
                              }}
                            />
                            <div className="pokemon-info">
                              <h4>{pokemon.apodo_pok || pokemon.nombre_pok}</h4>
                              <small>{pokemon.nombre_pok}</small>
                              <div className="pokemon-actions">
                                <button
                                  className="btn-edit-pokemon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openPokemonEditor(pokemon)
                                  }}
                                  style={{ 
                                    marginRight: '5px', 
                                    padding: '4px 8px', 
                                    backgroundColor: '#007bff', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    fontSize: '12px'
                                  }}
                                >
                                  ⚙️ Editar
                                </button>
                                <button
                                  className="btn-remove-pokemon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemovePokemonFromEquipo(pokemon.id_equipo_pokemon)
                                  }}
                                  style={{ 
                                    padding: '4px 8px', 
                                    backgroundColor: '#dc3545', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    fontSize: '12px'
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="empty-slot">
                            <span>Slot vacío</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal del Editor de Pokémon */}
      {showPokemonEditor && selectedPokemonForEdit && (
        <div className="pokemon-editor-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="pokemon-editor-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <div className="editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>⚙️ Editar {selectedPokemonForEdit.nombre_pok}</h3>
              <button
                onClick={() => setShowPokemonEditor(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div className="editor-form" style={{ display: 'grid', gap: '15px' }}>
              {/* Información básica */}
              <div className="basic-info">
                <h4>📝 Información Básica</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label>Apodo:</label>
                    <input
                      type="text"
                      value={pokemonEditData.apodo_pok}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, apodo_pok: e.target.value})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Nivel:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={pokemonEditData.nivel}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, nivel: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Naturaleza:</label>
                    <select
                      value={pokemonEditData.naturaleza}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, naturaleza: e.target.value})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    >
                      <option value="Hardy">Hardy (Neutral)</option>
                      <option value="Adamant">Adamant (+Ataque, -At. Especial)</option>
                      <option value="Modest">Modest (+At. Especial, -Ataque)</option>
                      <option value="Timid">Timid (+Velocidad, -Ataque)</option>
                      <option value="Jolly">Jolly (+Velocidad, -At. Especial)</option>
                      <option value="Bold">Bold (+Defensa, -Ataque)</option>
                      <option value="Calm">Calm (+Def. Especial, -Ataque)</option>
                    </select>
                  </div>
                  <div>
                    <label>Experiencia:</label>
                    <input
                      type="number"
                      min="0"
                      value={pokemonEditData.experiencia}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, experiencia: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                </div>
              </div>

              {/* IVs */}
              <div className="ivs-section">
                <h4>🧬 IVs (Individual Values) - Máximo 31</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label>HP:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={pokemonEditData.iv_hp}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, iv_hp: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Ataque:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={pokemonEditData.iv_ataque}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, iv_ataque: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Defensa:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={pokemonEditData.iv_defensa}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, iv_defensa: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>At. Especial:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={pokemonEditData.iv_ataque_especial}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, iv_ataque_especial: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Def. Especial:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={pokemonEditData.iv_defensa_especial}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, iv_defensa_especial: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Velocidad:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={pokemonEditData.iv_velocidad}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, iv_velocidad: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                </div>
              </div>

              {/* EVs */}
              <div className="evs-section">
                <h4>💪 EVs (Effort Values) - Total máximo: 510, Individual máximo: 252</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label>HP:</label>
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={pokemonEditData.ev_hp}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, ev_hp: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Ataque:</label>
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={pokemonEditData.ev_ataque}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, ev_ataque: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Defensa:</label>
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={pokemonEditData.ev_defensa}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, ev_defensa: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>At. Especial:</label>
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={pokemonEditData.ev_ataque_especial}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, ev_ataque_especial: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Def. Especial:</label>
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={pokemonEditData.ev_defensa_especial}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, ev_defensa_especial: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                  <div>
                    <label>Velocidad:</label>
                    <input
                      type="number"
                      min="0"
                      max="252"
                      value={pokemonEditData.ev_velocidad}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, ev_velocidad: parseInt(e.target.value)})}
                      style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  Total EVs: {pokemonEditData.ev_hp + pokemonEditData.ev_ataque + pokemonEditData.ev_defensa + 
                            pokemonEditData.ev_ataque_especial + pokemonEditData.ev_defensa_especial + pokemonEditData.ev_velocidad} / 510
                </div>
              </div>

              {/* Botones de acción */}
              <div className="editor-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setShowPokemonEditor(false)}
                  style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={savePokemonEdit}
                  style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamBuilder
