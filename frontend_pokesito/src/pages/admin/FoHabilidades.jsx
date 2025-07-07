import { useState, useEffect } from 'react'
import { habilidadesService } from '../../services/habilidades'
import '../../styles/FoHabilidades.css'

function FoHabilidades() {
  const [habilidades, setHabilidades] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingHabilidad, setEditingHabilidad] = useState(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })

  // Cargar habilidades al montar el componente
  useEffect(() => {
    loadHabilidades()
  }, [])

  const loadHabilidades = async () => {
    setLoading(true)
    try {
      const result = await habilidadesService.getAllHabilidades()
      if (result.success) {
        const habilidadesData = result.data || []
        setHabilidades(Array.isArray(habilidadesData) ? habilidadesData : [])
      } else {
        setError(result.message)
        setHabilidades([])
      }
    } catch (error) {
      setError('Error al cargar habilidades')
      setHabilidades([])
      console.error('Error:', error)
    } finally {
      setLoading(false)
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
      setError('El nombre de la habilidad es requerido')
      setLoading(false)
      return
    }

    if (!formData.descripcion.trim()) {
      setError('La descripción de la habilidad es requerida')
      setLoading(false)
      return
    }

    try {
      let result
      if (editingHabilidad) {
        // Actualizar habilidad existente
        result = await habilidadesService.updateHabilidad(editingHabilidad.id_habilidad, formData)
      } else {
        // Crear nueva habilidad
        result = await habilidadesService.createHabilidad(formData)
      }

      if (result.success) {
        setSuccess(result.message)
        resetForm()
        loadHabilidades() // Recargar la lista
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

  const handleEdit = (habilidad) => {
    setEditingHabilidad(habilidad)
    setFormData({
      nombre: habilidad.nombre || '',
      descripcion: habilidad.descripcion || ''
    })
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
      setLoading(true)
      try {
        const result = await habilidadesService.deleteHabilidad(id)
        if (result.success) {
          setSuccess('Habilidad eliminada exitosamente')
          loadHabilidades()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError('Error al eliminar habilidad')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: ''
    })
    setEditingHabilidad(null)
  }

  return (
    <div className="fo-habilidades-container">
      <div className="fo-habilidades-header">
        <h2>{editingHabilidad ? 'Editar Habilidad' : 'Agregar Nueva Habilidad'}</h2>
        {editingHabilidad && (
          <button onClick={resetForm} className="btn-cancel">
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Formulario */}
      <div className="fo-habilidades-form-container">
        <form onSubmit={handleSubmit} className="fo-habilidades-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Habilidad:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Ej: Torrente, Impulso, Garra Dura..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Descripción del efecto de la habilidad..."
              rows="4"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Procesando...' : editingHabilidad ? 'Actualizar Habilidad' : 'Crear Habilidad'}
          </button>
        </form>
      </div>

      {/* Lista de habilidades */}
      <div className="fo-habilidades-list-container">
        <h3>Habilidades Existentes</h3>
        {loading && <div className="loading">Cargando habilidades...</div>}
        
        <div className="habilidades-grid">
          {Array.isArray(habilidades) && habilidades.map((habilidad) => (
            <div key={habilidad.id_habilidad} className="habilidad-card">
              <div className="habilidad-info">
                <h4>{habilidad.nombre}</h4>
                <p className="habilidad-id">ID: {habilidad.id_habilidad}</p>
                <p className="habilidad-descripcion">{habilidad.descripcion}</p>
              </div>
              <div className="habilidad-actions">
                <button 
                  onClick={() => handleEdit(habilidad)}
                  className="btn-edit"
                  disabled={loading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(habilidad.id_habilidad)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(habilidades) && habilidades.length === 0 && !loading && (
          <div className="no-habilidades">No hay habilidades registradas</div>
        )}
      </div>
    </div>
  )
}

export default FoHabilidades
