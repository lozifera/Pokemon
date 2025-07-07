import { useState, useEffect } from 'react'
import { movimientosService } from '../../services/movimientos'
import { tipoService } from '../../services/tipoService'
import { catService } from '../../services/catService'
import '../../styles/ForMovimiento.css'

function ForMovimiento() {
  const [movimientos, setMovimientos] = useState([])
  const [tipos, setTipos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingMovimiento, setEditingMovimiento] = useState(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    id_tipo: '',
    id_cat: '',
    poder: '',
    ACC: '',
    PP: '',
    descripcion: ''
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    console.log('🎯 ForMovimiento: Componente montado, iniciando carga de datos')
    
    // Función de diagnóstico
    const diagnosticarConexion = async () => {
      console.log('🔍 Diagnosticando conexión al backend...')
      try {
        const response = await fetch('http://localhost:3001/api/tipos')
        console.log('🔗 Estado de conexión con /api/tipos:', response.status)
        
        const response2 = await fetch('http://localhost:3001/api/movimientos')
        console.log('🔗 Estado de conexión con /api/movimientos:', response2.status)
        
        const response3 = await fetch('http://localhost:3001/api/cat')
        console.log('🔗 Estado de conexión con /api/cat:', response3.status)
      } catch (error) {
        console.error('❌ Error de conexión:', error)
      }
    }
    
    diagnosticarConexion()
    loadMovimientos()
    loadTipos()
    loadCategorias()
  }, [])

  const loadMovimientos = async () => {
    console.log('🔄 Iniciando carga de movimientos...')
    setLoading(true)
    try {
      console.log('📡 Llamando a movimientosService.getAllMovimientos()')
      const result = await movimientosService.getAllMovimientos()
      console.log('📦 Respuesta de movimientos:', result)
      
      if (result.success) {
        const movimientosData = result.data || []
        console.log('✅ Movimientos obtenidos:', movimientosData)
        setMovimientos(Array.isArray(movimientosData) ? movimientosData : [])
      } else {
        console.error('❌ Error en resultado de movimientos:', result.message)
        setError(result.message)
        setMovimientos([])
      }
    } catch (error) {
      console.error('💥 Error al cargar movimientos:', error)
      setError('Error al cargar movimientos')
      setMovimientos([])
    } finally {
      console.log('🏁 Finalizando carga de movimientos')
      setLoading(false)
    }
  }

  const loadTipos = async () => {
    console.log('🔄 Iniciando carga de tipos...')
    try {
      console.log('📡 Llamando a tipoService.getAllTipos()')
      const result = await tipoService.getAllTipos()
      console.log('📦 Respuesta de tipos:', result)
      
      if (result.success) {
        // El servicio ya devuelve directamente el array de tipos
        const tiposData = result.data || []
        console.log('✅ Tipos obtenidos:', tiposData)
        console.log('🔢 Cantidad de tipos:', tiposData.length)
        setTipos(Array.isArray(tiposData) ? tiposData : [])
      } else {
        console.error('❌ Error al cargar tipos:', result.message)
        setTipos([])
      }
    } catch (error) {
      console.error('💥 Error al cargar tipos:', error)
      setTipos([])
    }
  }

  const loadCategorias = async () => {
    console.log('🔄 Iniciando carga de categorías...')
    try {
      console.log('📡 Llamando a catService.getAllCategorias()')
      const result = await catService.getAllCategorias()
      console.log('📦 Respuesta de categorías:', result)
      
      if (result.success) {
        const categoriasData = result.data || []
        console.log('✅ Categorías obtenidas:', categoriasData)
        setCategorias(Array.isArray(categoriasData) ? categoriasData : [])
      } else {
        console.error('❌ Error al cargar categorías:', result.message)
      }
    } catch (error) {
      console.error('💥 Error al cargar categorías:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar mensajes
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setError('El nombre del movimiento es requerido')
      setLoading(false)
      return
    }

    if (!formData.id_tipo) {
      setError('Debe seleccionar un tipo')
      setLoading(false)
      return
    }

    if (!formData.id_cat) {
      setError('Debe seleccionar una categoría')
      setLoading(false)
      return
    }

    // Convertir números a enteros
    const movimientoData = {
      ...formData,
      id_tipo: parseInt(formData.id_tipo),
      id_cat: parseInt(formData.id_cat),
      poder: formData.poder ? parseInt(formData.poder) : null,
      ACC: formData.ACC ? parseInt(formData.ACC) : null,
      PP: formData.PP ? parseInt(formData.PP) : null
    }

    try {
      let result
      if (editingMovimiento) {
        // Actualizar movimiento existente
        result = await movimientosService.updateMovimiento(editingMovimiento.id_movimiento, movimientoData)
      } else {
        // Crear nuevo movimiento
        result = await movimientosService.createMovimiento(movimientoData)
      }

      if (result.success) {
        setSuccess(result.message)
        resetForm()
        loadMovimientos() // Recargar la lista
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Error al procesar la solicitud')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (movimiento) => {
    setEditingMovimiento(movimiento)
    setFormData({
      nombre: movimiento.nombre || '',
      id_tipo: movimiento.id_tipo || '',
      id_cat: movimiento.id_cat || '',
      poder: movimiento.poder || '',
      ACC: movimiento.ACC || '',
      PP: movimiento.PP || '',
      descripcion: movimiento.descripcion || ''
    })
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este movimiento?')) {
      setLoading(true)
      try {
        const result = await movimientosService.deleteMovimiento(id)
        if (result.success) {
          setSuccess('Movimiento eliminado exitosamente')
          loadMovimientos()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError('Error al eliminar movimiento')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      id_tipo: '',
      id_cat: '',
      poder: '',
      ACC: '',
      PP: '',
      descripcion: ''
    })
    setEditingMovimiento(null)
  }

  // Función para obtener el nombre del tipo
  const getTipoNombre = (id_tipo) => {
    const tipo = tipos.find(t => t.id_tipo === id_tipo)
    return tipo ? tipo.nombre : 'Tipo no encontrado'
  }

  // Función para obtener el nombre de la categoría
  const getCategoriaNombre = (id_cat) => {
    const categoria = categorias.find(c => c.id_cat === id_cat)
    return categoria ? categoria.nombre : 'Categoría no encontrada'
  }

  return (
    <div className="for-movimiento-container">
      <div className="for-movimiento-header">
        <h2>{editingMovimiento ? 'Editar Movimiento' : 'Agregar Nuevo Movimiento'}</h2>
        {editingMovimiento && (
          <button onClick={resetForm} className="btn-cancel">
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Formulario */}
      <div className="for-movimiento-form-container">
        <form onSubmit={handleSubmit} className="for-movimiento-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Movimiento:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="Ej: Llamarada, Hidrobomba..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_tipo">Tipo:</label>
              <select
                id="id_tipo"
                name="id_tipo"
                value={formData.id_tipo}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">
                  {tipos.length === 0 ? 'Cargando tipos...' : 'Seleccionar tipo'}
                </option>
                {tipos.map(tipo => (
                  <option key={tipo.id_tipo} value={tipo.id_tipo}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id_cat">Categoría:</label>
              <select
                id="id_cat"
                name="id_cat"
                value={formData.id_cat}
                onChange={handleInputChange}
                required
                disabled={loading}
              >
                <option value="">
                  {categorias.length === 0 ? 'Cargando categorías...' : 'Seleccionar categoría'}
                </option>
                {categorias.map(categoria => (
                  <option key={categoria.id_cat} value={categoria.id_cat}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="poder">Poder:</label>
              <input
                type="number"
                id="poder"
                name="poder"
                value={formData.poder}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                max="999"
                placeholder="Ej: 110"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ACC">Precisión (ACC):</label>
              <input
                type="number"
                id="ACC"
                name="ACC"
                value={formData.ACC}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                max="100"
                placeholder="Ej: 85"
              />
            </div>

            <div className="form-group">
              <label htmlFor="PP">PP (Puntos de Poder):</label>
              <input
                type="number"
                id="PP"
                name="PP"
                value={formData.PP}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                max="99"
                placeholder="Ej: 5"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="Descripción del movimiento..."
              rows="3"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Procesando...' : editingMovimiento ? 'Actualizar Movimiento' : 'Crear Movimiento'}
          </button>
        </form>
      </div>

      {/* Lista de movimientos */}
      <div className="for-movimiento-list-container">
        <h3>Movimientos Existentes</h3>
        
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <div className="loading-message">Cargando movimientos...</div>
          </div>
        )}
        
        {!loading && (
          <div className="data-info">
            <p>📊 Movimientos cargados: {movimientos.length}</p>
            <p>🏷️ Tipos disponibles: {tipos.length}</p>
            <p>📂 Categorías disponibles: {categorias.length}</p>
          </div>
        )}
        
        <div className="movimientos-grid">
          {Array.isArray(movimientos) && movimientos.map((movimiento) => (
            <div key={movimiento.id_movimiento} className="movimiento-card">
              <div className="movimiento-info">
                <h4>{movimiento.nombre}</h4>
                <p><strong>Tipo:</strong> {getTipoNombre(movimiento.id_tipo)}</p>
                <p><strong>Categoría:</strong> {getCategoriaNombre(movimiento.id_cat)}</p>
                <div className="movimiento-stats">
                  <span className="stat">Poder: {movimiento.poder || 'N/A'}</span>
                  <span className="stat">ACC: {movimiento.ACC || 'N/A'}</span>
                  <span className="stat">PP: {movimiento.PP || 'N/A'}</span>
                </div>
                {movimiento.descripcion && (
                  <p className="movimiento-descripcion">{movimiento.descripcion}</p>
                )}
              </div>
              <div className="movimiento-actions">
                <button 
                  onClick={() => handleEdit(movimiento)}
                  className="btn-edit"
                  disabled={loading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(movimiento.id_movimiento)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(movimientos) && movimientos.length === 0 && !loading && (
          <div className="no-movimientos">No hay movimientos registrados</div>
        )}
      </div>
    </div>
  )
}

export default ForMovimiento
