import React, { useState, useEffect } from 'react'
import { 
  pokemonService 
  // pokemonHabilidadService, 
  // pokemonMovimientoService, 
  // pokemonTipoService 
} from '../../services/pokemonService'
import { habilidadesService } from '../../services/habilidades'
import { movimientosService } from '../../services/movimientos'
import { tipoService } from '../../services/tipoService'
import '../../styles/ForPokemon.css'

const ForPokemon = () => {
  // Estados para el formulario principal
  const [formData, setFormData] = useState({
    nombre_pok: '',
    HP: '',
    ataque: '',
    defensa: '',
    sp_ataque: '',
    sp_defensa: '',
    velocidad: '',
    image: null
  })

  // Estados para las relaciones
  const [selectedHabilidades, setSelectedHabilidades] = useState([])
  const [selectedMovimientos, setSelectedMovimientos] = useState([])
  const [selectedTipos, setSelectedTipos] = useState([])

  // Estados para los datos disponibles
  const [habilidades, setHabilidades] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [tipos, setTipos] = useState([])

  // Estados para el control del formulario
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [imagePreview, setImagePreview] = useState(null)
  const [editingPokemon, setEditingPokemon] = useState(null)

  const isEditing = !!editingPokemon

  // Cargar datos iniciales
  useEffect(() => {
    console.log('🎯 ForPokemon: Componente montado, cargando datos iniciales...')
    loadInitialData()
  }, [])

  // Cargar datos disponibles (habilidades, movimientos, tipos)
  const loadInitialData = async () => {
    console.log('🔄 Cargando datos iniciales...')
    setLoading(true)
    try {
      const [habilidadesResult, movimientosResult, tiposResult] = await Promise.all([
        habilidadesService.getAllHabilidades(),
        movimientosService.getAllMovimientos(),
        tipoService.getAllTipos()
      ])

      console.log('📦 Resultado habilidades:', habilidadesResult)
      console.log('📦 Resultado movimientos:', movimientosResult)
      console.log('📦 Resultado tipos:', tiposResult)

      if (habilidadesResult.success) {
        const habilidadesData = habilidadesResult.data || []
        console.log('✅ Habilidades cargadas:', habilidadesData)
        setHabilidades(Array.isArray(habilidadesData) ? habilidadesData : [])
      } else {
        console.error('❌ Error al cargar habilidades:', habilidadesResult.message)
        setHabilidades([])
      }

      if (movimientosResult.success) {
        const movimientosData = movimientosResult.data || []
        console.log('✅ Movimientos cargados:', movimientosData)
        setMovimientos(Array.isArray(movimientosData) ? movimientosData : [])
      } else {
        console.error('❌ Error al cargar movimientos:', movimientosResult.message)
        setMovimientos([])
      }

      if (tiposResult.success) {
        const tiposData = tiposResult.data || []
        console.log('✅ Tipos cargados:', tiposData)
        setTipos(Array.isArray(tiposData) ? tiposData : [])
      } else {
        console.error('❌ Error al cargar tipos:', tiposResult.message)
        setTipos([])
      }
    } catch (error) {
      console.error('💥 Error al cargar datos iniciales:', error)
      setHabilidades([])
      setMovimientos([])
      setTipos([])
    } finally {
      setLoading(false)
    }
  }

  // Función para limpiar el formulario
  const resetForm = () => {
    setFormData({
      nombre_pok: '',
      HP: '',
      ataque: '',
      defensa: '',
      sp_ataque: '',
      sp_defensa: '',
      velocidad: '',
      image: null
    })
    setSelectedHabilidades([])
    setSelectedMovimientos([])
    setSelectedTipos([])
    setEditingPokemon(null)
    setImagePreview(null)
    setErrors({})
  }

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Solo se permiten archivos JPG, JPEG o PNG'
        }))
        return
      }

      // Validar tamaño (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'La imagen no puede ser mayor a 5MB'
        }))
        return
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }))

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)

      // Limpiar error si existe
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }))
      }
    }
  }

  // Manejar selección de habilidades
  const handleHabilidadChange = (habilidadId, isChecked, tipo = 'normal') => {
    if (isChecked) {
      setSelectedHabilidades(prev => [...prev, { id_habilidad: habilidadId, tipo }])
    } else {
      setSelectedHabilidades(prev => prev.filter(h => h.id_habilidad !== habilidadId))
    }
  }

  // Manejar selección de movimientos
  const handleMovimientoChange = (movimientoId, isChecked) => {
    if (isChecked) {
      setSelectedMovimientos(prev => [...prev, movimientoId])
    } else {
      setSelectedMovimientos(prev => prev.filter(id => id !== movimientoId))
    }
  }

  // Manejar selección de tipos
  const handleTipoChange = (tipoId, isChecked) => {
    if (isChecked) {
      // Máximo 2 tipos
      if (selectedTipos.length >= 2) {
        alert('Un Pokemon puede tener máximo 2 tipos')
        return
      }
      setSelectedTipos(prev => [...prev, tipoId])
    } else {
      setSelectedTipos(prev => prev.filter(id => id !== tipoId))
    }
  }

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    // Validar campos requeridos
    if (!formData.nombre_pok.trim()) {
      newErrors.nombre_pok = 'El nombre es requerido'
    }

    // Validar estadísticas
    const stats = ['HP', 'ataque', 'defensa', 'sp_ataque', 'sp_defensa', 'velocidad']
    stats.forEach(stat => {
      if (!formData[stat] || formData[stat] < 0) {
        newErrors[stat] = 'Debe ser un número positivo'
      }
    })

    // Validar imagen (solo si es nuevo Pokemon)
    if (!isEditing && !formData.image) {
      // Hacer la imagen opcional por ahora para probar
      console.log('⚠️ Imagen no requerida temporalmente para pruebas')
      // newErrors.image = 'La imagen es requerida'
    }

    // Validar que tenga al menos un tipo
    if (selectedTipos.length === 0) {
      newErrors.tipos = 'Debe seleccionar al menos un tipo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      console.log('🚀 Iniciando creación de Pokemon...')
      console.log('📦 Datos del formulario:', formData)
      
      let pokemonResult

      if (isEditing) {
        // Actualizar Pokemon existente
        console.log('✏️ Actualizando Pokemon existente...')
        pokemonResult = await pokemonService.updatePokemon(editingPokemon.id_pokemon, formData)
      } else {
        // Crear nuevo Pokemon
        console.log('🆕 Creando nuevo Pokemon...')
        pokemonResult = await pokemonService.createPokemon(formData)
      }

      console.log('📋 Resultado del servicio Pokemon:', pokemonResult)

      if (!pokemonResult.success) {
        throw new Error(pokemonResult.message)
      }

      console.log('✅ Pokemon creado/actualizado exitosamente')
      // const pokemonId = isEditing ? editingPokemon.id_pokemon : pokemonResult.data.id_pokemon

      // Solo procesar relaciones si tenemos selecciones
      console.log('🔗 Procesando relaciones...')
      console.log('  - Habilidades seleccionadas:', selectedHabilidades)
      console.log('  - Movimientos seleccionados:', selectedMovimientos)
      console.log('  - Tipos seleccionados:', selectedTipos)

      // Por ahora, skip las relaciones para probar solo la creación básica
      /*
      // Actualizar relaciones
      const relationPromises = []

      // Actualizar habilidades
      if (selectedHabilidades.length > 0) {
        relationPromises.push(
          pokemonHabilidadService.updatePokemonHabilidades(pokemonId, selectedHabilidades)
        )
      }

      // Actualizar movimientos
      if (selectedMovimientos.length > 0) {
        relationPromises.push(
          pokemonMovimientoService.updatePokemonMovimientos(pokemonId, selectedMovimientos)
        )
      }

      // Actualizar tipos
      if (selectedTipos.length > 0) {
        relationPromises.push(
          pokemonTipoService.updatePokemonTipos(pokemonId, selectedTipos)
        )
      }

      await Promise.all(relationPromises)
      */

      alert(isEditing ? 'Pokemon actualizado exitosamente' : 'Pokemon creado exitosamente')
      
      // Limpiar formulario después de crear/editar
      resetForm()

    } catch (error) {
      console.error('💥 Error al guardar Pokemon:', error)
      alert('Error al guardar Pokemon: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-pokemon-container">
      <div className="form-pokemon-header">
        <h2>{isEditing ? 'Editar Pokemon' : 'Crear Nuevo Pokemon'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form-pokemon">
        {/* Información básica del Pokemon */}
        <div className="form-section">
          <h3>Información Básica</h3>
          
          <div className="form-group">
            <label htmlFor="nombre_pok">Nombre del Pokemon *</label>
            <input
              type="text"
              id="nombre_pok"
              name="nombre_pok"
              value={formData.nombre_pok}
              onChange={handleInputChange}
              className={errors.nombre_pok ? 'error' : ''}
              placeholder="Ingrese el nombre del Pokemon"
            />
            {errors.nombre_pok && <span className="error-message">{errors.nombre_pok}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen del Pokemon (opcional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className={errors.image ? 'error' : ''}
            />
            {errors.image && <span className="error-message">{errors.image}</span>}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="form-section">
          <h3>Estadísticas</h3>
          
          <div className="stats-grid">
            <div className="form-group">
              <label htmlFor="HP">HP *</label>
              <input
                type="number"
                id="HP"
                name="HP"
                value={formData.HP}
                onChange={handleInputChange}
                className={errors.HP ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.HP && <span className="error-message">{errors.HP}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="ataque">Ataque *</label>
              <input
                type="number"
                id="ataque"
                name="ataque"
                value={formData.ataque}
                onChange={handleInputChange}
                className={errors.ataque ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.ataque && <span className="error-message">{errors.ataque}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="defensa">Defensa *</label>
              <input
                type="number"
                id="defensa"
                name="defensa"
                value={formData.defensa}
                onChange={handleInputChange}
                className={errors.defensa ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.defensa && <span className="error-message">{errors.defensa}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sp_ataque">Ataque Especial *</label>
              <input
                type="number"
                id="sp_ataque"
                name="sp_ataque"
                value={formData.sp_ataque}
                onChange={handleInputChange}
                className={errors.sp_ataque ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.sp_ataque && <span className="error-message">{errors.sp_ataque}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sp_defensa">Defensa Especial *</label>
              <input
                type="number"
                id="sp_defensa"
                name="sp_defensa"
                value={formData.sp_defensa}
                onChange={handleInputChange}
                className={errors.sp_defensa ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.sp_defensa && <span className="error-message">{errors.sp_defensa}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="velocidad">Velocidad *</label>
              <input
                type="number"
                id="velocidad"
                name="velocidad"
                value={formData.velocidad}
                onChange={handleInputChange}
                className={errors.velocidad ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.velocidad && <span className="error-message">{errors.velocidad}</span>}
            </div>
          </div>
        </div>

        {/* Tipos */}
        <div className="form-section">
          <h3>Tipos * (máximo 2)</h3>
          {errors.tipos && <span className="error-message">{errors.tipos}</span>}
          
          <div className="checkbox-grid">
            {tipos.map(tipo => (
              <div key={tipo.id_tipo} className="checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedTipos.includes(tipo.id_tipo)}
                    onChange={(e) => handleTipoChange(tipo.id_tipo, e.target.checked)}
                    disabled={!selectedTipos.includes(tipo.id_tipo) && selectedTipos.length >= 2}
                  />
                  <span className={`tipo-badge tipo-${tipo.nombre?.toLowerCase()}`}>
                    {tipo.nombre}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Habilidades */}
        <div className="form-section">
          <h3>Habilidades</h3>
          
          <div className="habilidades-section">
            <h4>Habilidades Normales</h4>
            <div className="checkbox-grid">
              {habilidades.map(habilidad => (
                <div key={`normal-${habilidad.id_habilidad}`} className="checkbox-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedHabilidades.some(h => h.id_habilidad === habilidad.id_habilidad && h.tipo === 'normal')}
                      onChange={(e) => handleHabilidadChange(habilidad.id_habilidad, e.target.checked, 'normal')}
                    />
                    {habilidad.nombre}
                  </label>
                </div>
              ))}
            </div>

            <h4>Habilidades Ocultas</h4>
            <div className="checkbox-grid">
              {habilidades.map(habilidad => (
                <div key={`oculta-${habilidad.id_habilidad}`} className="checkbox-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedHabilidades.some(h => h.id_habilidad === habilidad.id_habilidad && h.tipo === 'oculta')}
                      onChange={(e) => handleHabilidadChange(habilidad.id_habilidad, e.target.checked, 'oculta')}
                    />
                    {habilidad.nombre} (Oculta)
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movimientos */}
        <div className="form-section">
          <h3>Movimientos</h3>
          
          <div className="checkbox-grid">
            {movimientos.map(movimiento => (
              <div key={movimiento.id_movimiento} className="checkbox-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedMovimientos.includes(movimiento.id_movimiento)}
                    onChange={(e) => handleMovimientoChange(movimiento.id_movimiento, e.target.checked)}
                  />
                  <span className="movimiento-info">
                    <strong>{movimiento.nombre}</strong>
                    <small>Potencia: {movimiento.poder || 'N/A'}</small>
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={resetForm}
            disabled={loading}
          >
            {isEditing ? 'Cancelar Edición' : 'Limpiar Formulario'}
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')} Pokemon
          </button>
        </div>
      </form>
    </div>
  )
}

export default ForPokemon
