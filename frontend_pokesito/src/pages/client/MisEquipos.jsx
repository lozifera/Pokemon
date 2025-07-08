import React, { useState, useEffect } from 'react'
import { useUserEquipos } from '../../hooks/useUserEquipos'
import { equipoPokemonService } from '../../services/equiposService'
import { articuloService } from '../../services/articuloService'
import { habilidadesService } from '../../services/habilidades'
import { movimientosService } from '../../services/movimientos'
import '../../styles/MisEquipos.css'

const MisEquipos = () => {
  const { equipos, loading: equiposLoading } = useUserEquipos()
  
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [equipoPokemon, setEquipoPokemon] = useState([])
  const [loadingPokemon, setLoadingPokemon] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  
  // Datos para los combos
  const [articulos, setArticulos] = useState([])
  const [habilidades, setHabilidades] = useState([])
  const [movimientos, setMovimientos] = useState([])
  
  // Estado para el Pokémon que se está editando
  const [editingPokemon, setEditingPokemon] = useState({
    id: null,
    apodo_pok: '',
    nivel: 50,
    experiencia: 0,
    id_articulo: null,
    id_habilidad: null,
    movimientos: [null, null, null, null], // Array de 4 movimientos
    // IVs
    iv_hp: 31,
    iv_ataque: 31,
    iv_defensa: 31,
    iv_ataque_especial: 31,
    iv_defensa_especial: 31,
    iv_velocidad: 31,
    // EVs
    ev_hp: 0,
    ev_ataque: 0,
    ev_defensa: 0,
    ev_ataque_especial: 0,
    ev_defensa_especial: 0,
    ev_velocidad: 0,
    naturaleza: 'Hardy'
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadArticulos()
    loadHabilidades()
    loadMovimientos()
  }, [])

  // Cargar Pokémon del equipo seleccionado
  useEffect(() => {
    if (selectedEquipo) {
      // Limpiar Pokémon anteriores inmediatamente
      setEquipoPokemon([])
      console.log('Cargando Pokémon para equipo:', selectedEquipo.id_equipo)
      loadEquipoPokemon(selectedEquipo.id_equipo)
    } else {
      // Si no hay equipo seleccionado, limpiar la lista
      setEquipoPokemon([])
    }
  }, [selectedEquipo])

  const loadArticulos = async () => {
    try {
      const response = await articuloService.getAllArticulos()
      if (response.success) {
        setArticulos(response.data || [])
      }
    } catch (error) {
      console.error('Error al cargar artículos:', error)
    }
  }

  const loadHabilidades = async () => {
    try {
      const response = await habilidadesService.getAllHabilidades()
      if (response.success) {
        setHabilidades(response.data || [])
      }
    } catch (error) {
      console.error('Error al cargar habilidades:', error)
    }
  }

  const loadMovimientos = async () => {
    try {
      const response = await movimientosService.getAllMovimientos()
      if (response.success) {
        setMovimientos(response.data || [])
      }
    } catch (error) {
      console.error('Error al cargar movimientos:', error)
    }
  }

  const loadEquipoPokemon = async (equipoId) => {
    console.log('loadEquipoPokemon called with equipoId:', equipoId)
    setLoadingPokemon(true)
    
    try {
      const response = await equipoPokemonService.getEquipoPokemon(equipoId)
      console.log('Respuesta del servicio:', response)
      
      if (response.success) {
        const pokemonData = response.data || []
        console.log('Pokémon cargados:', pokemonData)
        console.log('Información del equipo:', response.equipo)
        console.log('Total de Pokémon:', response.total)
        setEquipoPokemon(pokemonData)
      } else {
        console.error('Error en la respuesta:', response.message)
        setEquipoPokemon([])
      }
    } catch (error) {
      console.error('Error al cargar Pokémon del equipo:', error)
      setEquipoPokemon([])
    } finally {
      setLoadingPokemon(false)
    }
  }

  // Función para probar la nueva ruta
  const testNewRoute = async (equipoId) => {
    console.log('🔍 Probando nueva ruta para equipo:', equipoId)
    try {
      const response = await equipoPokemonService.testNewRoute(equipoId)
      if (response.success) {
        console.log('✅ Prueba exitosa:', response.data)
        alert('¡Prueba exitosa! Revisa la consola para ver los detalles.')
      } else {
        console.error('❌ Error en la prueba:', response.message)
        alert('Error en la prueba: ' + response.message)
      }
    } catch (error) {
      console.error('❌ Error al probar la nueva ruta:', error)
      alert('Error al probar la nueva ruta')
    }
  }

  const handleEditPokemon = (pokemon) => {
    setEditingPokemon({
      id: pokemon.id_equipo_pokemon,
      apodo_pok: pokemon.apodo_pok || '',
      nivel: pokemon.nivel || 50,
      experiencia: pokemon.experiencia || 0,
      id_articulo: pokemon.id_articulo || null,
      id_habilidad: pokemon.id_habilidad || null,
      movimientos: [
        pokemon.movimiento_1 || null,
        pokemon.movimiento_2 || null,
        pokemon.movimiento_3 || null,
        pokemon.movimiento_4 || null
      ],
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
      naturaleza: pokemon.naturaleza || 'Hardy'
    })
    setShowEditModal(true)
  }

  const handleUpdatePokemon = async (e) => {
    e.preventDefault()
    
    try {
      const updateData = {
        apodo_pok: editingPokemon.apodo_pok,
        nivel: parseInt(editingPokemon.nivel),
        experiencia: parseInt(editingPokemon.experiencia),
        id_articulo: editingPokemon.id_articulo || null,
        id_habilidad: editingPokemon.id_habilidad || null,
        movimiento_1: editingPokemon.movimientos[0] || null,
        movimiento_2: editingPokemon.movimientos[1] || null,
        movimiento_3: editingPokemon.movimientos[2] || null,
        movimiento_4: editingPokemon.movimientos[3] || null,
        // IVs
        iv_hp: parseInt(editingPokemon.iv_hp),
        iv_ataque: parseInt(editingPokemon.iv_ataque),
        iv_defensa: parseInt(editingPokemon.iv_defensa),
        iv_ataque_especial: parseInt(editingPokemon.iv_ataque_especial),
        iv_defensa_especial: parseInt(editingPokemon.iv_defensa_especial),
        iv_velocidad: parseInt(editingPokemon.iv_velocidad),
        // EVs
        ev_hp: parseInt(editingPokemon.ev_hp),
        ev_ataque: parseInt(editingPokemon.ev_ataque),
        ev_defensa: parseInt(editingPokemon.ev_defensa),
        ev_ataque_especial: parseInt(editingPokemon.ev_ataque_especial),
        ev_defensa_especial: parseInt(editingPokemon.ev_defensa_especial),
        ev_velocidad: parseInt(editingPokemon.ev_velocidad),
        naturaleza: editingPokemon.naturaleza
      }

      const response = await equipoPokemonService.updateEquipoPokemon(editingPokemon.id, updateData)
      
      if (response.success) {
        alert('Pokémon actualizado exitosamente')
        setShowEditModal(false)
        loadEquipoPokemon(selectedEquipo.id_equipo) // Recargar la lista
      } else {
        alert('Error al actualizar Pokémon: ' + response.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar Pokémon')
    }
  }

  const handleInputChange = (field, value) => {
    setEditingPokemon(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMovimientoChange = (index, movimientoId) => {
    setEditingPokemon(prev => ({
      ...prev,
      movimientos: prev.movimientos.map((mov, i) => 
        i === index ? movimientoId : mov
      )
    }))
  }

  const getArticuloNombre = (id) => {
    const articulo = articulos.find(art => art.id_articulo === id)
    return articulo ? articulo.nombre : 'Sin artículo'
  }

  const getHabilidadNombre = (id) => {
    const habilidad = habilidades.find(hab => hab.id_habilidad === id)
    return habilidad ? habilidad.nombre : 'Sin habilidad'
  }

  const getMovimientoNombre = (id) => {
    const movimiento = movimientos.find(mov => mov.id_movimiento === id)
    return movimiento ? movimiento.nombre : 'Sin movimiento'
  }

  if (equiposLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando equipos...</p>
      </div>
    )
  }

  return (
    <div className="mis-equipos-container">
      <header className="mis-equipos-header">
        <h1>🎮 Mis Equipos</h1>
        <p>Gestiona tus equipos Pokémon</p>
      </header>

      <div className="equipos-layout">
        {/* Lista de equipos */}
        <div className="equipos-sidebar">
          <h2>Tus Equipos</h2>
          {equipos.length === 0 ? (
            <p className="no-equipos">No tienes equipos creados aún.</p>
          ) : (
            <div className="equipos-list">
              {equipos.map(equipo => (
                <div 
                  key={equipo.id_equipo} 
                  className={`equipo-item ${selectedEquipo?.id_equipo === equipo.id_equipo ? 'selected' : ''}`}
                  onClick={() => setSelectedEquipo(equipo)}
                >
                  <h3>{equipo.nombre}</h3>
                  <p>Equipo #{equipo.id_equipo}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detalle del equipo */}
        <div className="equipo-detail">
          {selectedEquipo ? (
            <>
              <div className="equipo-header">
                <h2>Equipo: {selectedEquipo.nombre}</h2>
                <div className="equipo-actions">
                  <button 
                    className="reload-btn"
                    onClick={() => loadEquipoPokemon(selectedEquipo.id_equipo)}
                    disabled={loadingPokemon}
                  >
                    🔄 Recargar Pokémon
                  </button>
                  <button 
                    className="test-btn"
                    onClick={() => testNewRoute(selectedEquipo.id_equipo)}
                    disabled={loadingPokemon}
                    style={{ 
                      marginLeft: '10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🔍 Probar Nueva Ruta
                  </button>
                </div>
              </div>
              
              {loadingPokemon ? (
                <div className="loading-pokemon">
                  <div className="loading-spinner"></div>
                  <p>Cargando Pokémon del equipo...</p>
                </div>
              ) : equipoPokemon.length === 0 ? (
                <p className="no-pokemon">Este equipo no tiene Pokémon aún.</p>
              ) : (
                <div className="pokemon-grid">
                  {equipoPokemon.map(pokemon => (
                    <div key={pokemon.id_equipo_pokemon} className="pokemon-card">
                      <div className="pokemon-header">
                        <h3>{pokemon.apodo_pok || pokemon.nombre_pok}</h3>
                        <span className="pokemon-nivel">Nv. {pokemon.nivel}</span>
                      </div>
                      
                      <div className="pokemon-info">
                        <p><strong>Pokémon:</strong> {pokemon.nombre_pok}</p>
                        <p style={{backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem'}}>
                          <strong>Equipo ID:</strong> {pokemon.id_equipo} (Debug)
                        </p>
                        <p><strong>Artículo:</strong> {getArticuloNombre(pokemon.id_articulo)}</p>
                        <p><strong>Habilidad:</strong> {getHabilidadNombre(pokemon.id_habilidad)}</p>
                        <p><strong>Naturaleza:</strong> {pokemon.naturaleza}</p>
                        
                        <div className="pokemon-movimientos">
                          <strong>Movimientos:</strong>
                          <ul>
                            {[pokemon.movimiento_1, pokemon.movimiento_2, pokemon.movimiento_3, pokemon.movimiento_4]
                              .filter(mov => mov)
                              .map((movId, index) => (
                                <li key={index}>{getMovimientoNombre(movId)}</li>
                              ))}
                          </ul>
                        </div>
                      </div>
                      
                      <button 
                        className="edit-pokemon-btn"
                        onClick={() => handleEditPokemon(pokemon)}
                      >
                        Editar Pokémon
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="no-selection">
              <p>Selecciona un equipo para ver sus Pokémon</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <h2>Editar Pokémon</h2>
            <form onSubmit={handleUpdatePokemon}>
              <div className="form-grid">
                {/* Información básica */}
                <div className="form-section">
                  <h3>Información Básica</h3>
                  
                  <div className="form-group">
                    <label>Apodo:</label>
                    <input
                      type="text"
                      value={editingPokemon.apodo_pok}
                      onChange={(e) => handleInputChange('apodo_pok', e.target.value)}
                      placeholder="Nombre personalizado"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nivel:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editingPokemon.nivel}
                      onChange={(e) => handleInputChange('nivel', e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Naturaleza:</label>
                    <select
                      value={editingPokemon.naturaleza}
                      onChange={(e) => handleInputChange('naturaleza', e.target.value)}
                    >
                      <option value="Hardy">Hardy</option>
                      <option value="Lonely">Lonely</option>
                      <option value="Brave">Brave</option>
                      <option value="Adamant">Adamant</option>
                      <option value="Naughty">Naughty</option>
                      <option value="Bold">Bold</option>
                      <option value="Docile">Docile</option>
                      <option value="Relaxed">Relaxed</option>
                      <option value="Impish">Impish</option>
                      <option value="Lax">Lax</option>
                      <option value="Timid">Timid</option>
                      <option value="Hasty">Hasty</option>
                      <option value="Serious">Serious</option>
                      <option value="Jolly">Jolly</option>
                      <option value="Naive">Naive</option>
                      <option value="Modest">Modest</option>
                      <option value="Mild">Mild</option>
                      <option value="Quiet">Quiet</option>
                      <option value="Bashful">Bashful</option>
                      <option value="Rash">Rash</option>
                      <option value="Calm">Calm</option>
                      <option value="Gentle">Gentle</option>
                      <option value="Sassy">Sassy</option>
                      <option value="Careful">Careful</option>
                      <option value="Quirky">Quirky</option>
                    </select>
                  </div>
                </div>

                {/* Artículo y Habilidad */}
                <div className="form-section">
                  <h3>Artículo y Habilidad</h3>
                  
                  <div className="form-group">
                    <label>Artículo:</label>
                    <select
                      value={editingPokemon.id_articulo || ''}
                      onChange={(e) => handleInputChange('id_articulo', e.target.value || null)}
                    >
                      <option value="">Sin artículo</option>
                      {articulos.map(articulo => (
                        <option key={articulo.id_articulo} value={articulo.id_articulo}>
                          {articulo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Habilidad:</label>
                    <select
                      value={editingPokemon.id_habilidad || ''}
                      onChange={(e) => handleInputChange('id_habilidad', e.target.value || null)}
                    >
                      <option value="">Sin habilidad</option>
                      {habilidades.map(habilidad => (
                        <option key={habilidad.id_habilidad} value={habilidad.id_habilidad}>
                          {habilidad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Movimientos */}
                <div className="form-section">
                  <h3>Movimientos (máximo 4)</h3>
                  
                  {[0, 1, 2, 3].map(index => (
                    <div key={index} className="form-group">
                      <label>Movimiento {index + 1}:</label>
                      <select
                        value={editingPokemon.movimientos[index] || ''}
                        onChange={(e) => handleMovimientoChange(index, e.target.value || null)}
                      >
                        <option value="">Sin movimiento</option>
                        {movimientos.map(movimiento => (
                          <option key={movimiento.id_movimiento} value={movimiento.id_movimiento}>
                            {movimiento.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                {/* IVs */}
                <div className="form-section">
                  <h3>IVs (Individual Values)</h3>
                  
                  {['hp', 'ataque', 'defensa', 'ataque_especial', 'defensa_especial', 'velocidad'].map(stat => (
                    <div key={stat} className="form-group">
                      <label>IV {stat.replace('_', ' ').toUpperCase()}:</label>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={editingPokemon[`iv_${stat}`]}
                        onChange={(e) => handleInputChange(`iv_${stat}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                {/* EVs */}
                <div className="form-section">
                  <h3>EVs (Effort Values)</h3>
                  
                  {['hp', 'ataque', 'defensa', 'ataque_especial', 'defensa_especial', 'velocidad'].map(stat => (
                    <div key={stat} className="form-group">
                      <label>EV {stat.replace('_', ' ').toUpperCase()}:</label>
                      <input
                        type="number"
                        min="0"
                        max="255"
                        value={editingPokemon[`ev_${stat}`]}
                        onChange={(e) => handleInputChange(`ev_${stat}`, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Guardar Cambios
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MisEquipos
