import React, { useState, useEffect } from 'react'
import { pokemonService } from '../../services/pokemonService'
import ImageDiagnostic from '../../components/ImageDiagnostic'
import '../../styles/PokemonList.css'

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadPokemons()
  }, [])

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

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.nombre_pok?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="pokemon-list-container">
      <div className="pokemon-list-header">
        <h2>🔍 Explorar Pokémon</h2>
        <p>Descubre todos los Pokémon disponibles</p>
      </div>

      {/* Componente de diagnóstico */}
      <ImageDiagnostic />

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
        <>
          {/* Debug info */}
          <div className="debug-info" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
            <p><strong>Total Pokémon:</strong> {filteredPokemons.length}</p>
            <p><strong>Ejemplo de imagen:</strong> {filteredPokemons[0]?.img_pok || 'No disponible'}</p>
          </div>
          
          <div className="pokemon-grid">
            {filteredPokemons.map(pokemon => (
              <div key={pokemon.id_pokemon} className="pokemon-card">
                <div className="pokemon-image">
                  <img 
                    src={pokemon.img_pok || pokemon.imagen || '/pokemon-placeholder.svg'} 
                    alt={pokemon.nombre_pok}
                    onError={(e) => {
                      console.log('Error cargando imagen:', pokemon.img_pok || pokemon.imagen)
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
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default PokemonList
