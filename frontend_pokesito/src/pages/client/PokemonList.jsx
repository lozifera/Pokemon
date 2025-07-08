import React, { useState, useEffect } from 'react'
import { pokemonService } from '../../services/pokemonService'
import { equipoPokemonService } from '../../services/equiposService'
import { useUserEquipos } from '../../hooks/useUserEquipos'
import '../../styles/PokemonList.css'

const PokemonList = () => {
  const { equipos } = useUserEquipos()
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState(null)
  const [selectedEquipo, setSelectedEquipo] = useState(null)

  useEffect(() => {
    loadPokemons()
  }, [])

  // Función para obtener la URL correcta de la imagen
  const getImageUrl = (pokemon) => {
    if (!pokemon) return '/pokemon-placeholder.svg'
    
    // Si tiene img_pok, construir la URL completa
    if (pokemon.img_pok) {
      // Si ya es una URL completa, usarla tal como está
      if (pokemon.img_pok.startsWith('http')) {
        return pokemon.img_pok
      }
      // Si es una ruta relativa, construir la URL completa
      return `http://localhost:3001/${pokemon.img_pok}`
    }
    
    // Si tiene path, construir la URL completa (similar a FoTipo)
    if (pokemon.path) {
      return `http://localhost:3001/${pokemon.path}`
    }
    
    // Si tiene imagen, construir la URL completa
    if (pokemon.imagen) {
      if (pokemon.imagen.startsWith('http')) {
        return pokemon.imagen
      }
      return `http://localhost:3001/${pokemon.imagen}`
    }
    
    // Fallback al placeholder
    return '/pokemon-placeholder.svg'
  }

  const loadPokemons = async () => {
    setLoading(true)
    try {
      const result = await pokemonService.getAllPokemon()
      if (result.success) {
        setPokemons(Array.isArray(result.data) ? result.data : [])
      } else {
        console.error('Error al cargar Pokémon:', result.message)
        setPokemons([])
      }
    } catch (error) {
      console.error('Error:', error)
      setPokemons([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddToTeam = (pokemon) => {
    setSelectedPokemon(pokemon)
    setShowAddModal(true)
  }

  const handleAddPokemonToEquipo = async () => {
    if (!selectedEquipo || !selectedPokemon) {
      alert('Selecciona un equipo y un Pokémon')
      return
    }

    try {
      const pokemonData = {
        id_equipo: selectedEquipo.id_equipo,
        id_pokemon: selectedPokemon.id_pokemon,
        nombre_pok: selectedPokemon.nombre_pok,
        apodo_pok: selectedPokemon.nombre_pok,
        img_pok: getImageUrl(selectedPokemon),
        nivel: 50,
        experiencia: 0
      }

      console.log('Agregando Pokémon al equipo:', pokemonData)
      const result = await equipoPokemonService.addPokemonToEquipo(pokemonData)
      
      if (result.success) {
        alert(`${selectedPokemon.nombre_pok} agregado al equipo ${selectedEquipo.nombre} exitosamente`)
        setShowAddModal(false)
        setSelectedPokemon(null)
        setSelectedEquipo(null)
      } else {
        alert(result.message || 'Error al agregar Pokémon al equipo')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al agregar Pokémon al equipo')
    }
  }

  const closeAddModal = () => {
    setShowAddModal(false)
    setSelectedPokemon(null)
    setSelectedEquipo(null)
  }

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.nombre_pok?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-list-header">
        <h2>🔍 Explorar Pokémon</h2>
        <p>Descubre todos los Pokémon disponibles</p>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Buscar Pokémon por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Cargando Pokémon...</div>
      ) : filteredPokemons.length === 0 ? (
        <div className="no-pokemon">
          {searchTerm ? `No se encontraron Pokémon con "${searchTerm}"` : 'No hay Pokémon disponibles'}
        </div>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemons.map(pokemon => (
              <div key={pokemon.id_pokemon} className="pokemon-card">
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
                    <div className="stat">
                      <span className="stat-label">HP:</span>
                      <span className="stat-value">{pokemon.HP || 'N/A'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">ATK:</span>
                      <span className="stat-value">{pokemon.ataque || 'N/A'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">DEF:</span>
                      <span className="stat-value">{pokemon.defensa || 'N/A'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">SPD:</span>
                      <span className="stat-value">{pokemon.velocidad || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="pokemon-actions">
                    <button
                      className="btn-add-to-team"
                      onClick={() => handleAddToTeam(pokemon)}
                      title="Agregar a equipo"
                    >
                      ➕ Agregar a Equipo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}

      {/* Modal para agregar Pokémon a equipo */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Agregar {selectedPokemon?.nombre_pok} a un Equipo</h3>
              <button className="btn-close" onClick={closeAddModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="selected-pokemon-info">
                <img 
                  src={getImageUrl(selectedPokemon)} 
                  alt={selectedPokemon?.nombre_pok}
                  className="modal-pokemon-image"
                />
                <h4>{selectedPokemon?.nombre_pok}</h4>
              </div>

              <div className="team-selection">
                <h4>Selecciona un Equipo:</h4>
                {equipos.length === 0 ? (
                  <p>No tienes equipos creados. Ve a Team Builder para crear uno.</p>
                ) : (
                  <div className="team-list">
                    {equipos.map(equipo => (
                      <div 
                        key={equipo.id_equipo}
                        className={`team-option ${selectedEquipo?.id_equipo === equipo.id_equipo ? 'selected' : ''}`}
                        onClick={() => setSelectedEquipo(equipo)}
                      >
                        <span className="team-name">{equipo.nombre}</span>
                        <span className="team-pokemon-count">
                          {equipo.pokemon_count || 0}/6 Pokémon
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-confirm" 
                  onClick={handleAddPokemonToEquipo}
                  disabled={!selectedEquipo}
                >
                  Agregar al Equipo
                </button>
                <button className="btn-cancel" onClick={closeAddModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PokemonList
