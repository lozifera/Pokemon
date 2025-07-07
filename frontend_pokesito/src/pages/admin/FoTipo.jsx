import { useState, useEffect } from 'react'
import { tipoService } from '../../services/tipoService'
import '../../styles/FoTipo.css'

function FoTipo() {
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingTipo, setEditingTipo] = useState(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: null
  })
  const [imagePreview, setImagePreview] = useState('')

  // Cargar tipos al montar el componente
  useEffect(() => {
    loadTipos()
  }, [])

  const loadTipos = async () => {
    setLoading(true)
    try {
      const result = await tipoService.getAllTipos()
      if (result.success) {
        // Asegurar que siempre tengamos un array
        const tiposData = result.data || []
        setTipos(Array.isArray(tiposData) ? tiposData : [])
      } else {
        setError(result.message)
        setTipos([]) // Asegurar que sea un array vacío en caso de error
      }
    } catch (error) {
      setError('Error al cargar tipos')
      setTipos([]) // Asegurar que sea un array vacío en caso de error
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }))
      
      // Crear preview de la imagen
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result
      if (editingTipo) {
        // Actualizar tipo existente
        result = await tipoService.updateTipo(editingTipo.id_tipo, formData)
      } else {
        // Crear nuevo tipo
        result = await tipoService.createTipo(formData)
      }

      if (result.success) {
        setSuccess(result.message)
        resetForm()
        loadTipos() // Recargar la lista
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

  const handleEdit = (tipo) => {
    setEditingTipo(tipo)
    setFormData({
      nombre: tipo.nombre,
      imagen: null
    })
    // Mostrar imagen actual si existe
    if (tipo.path) {
      setImagePreview(`http://localhost:3001/${tipo.path}`)
    }
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo?')) {
      setLoading(true)
      try {
        const result = await tipoService.deleteTipo(id)
        if (result.success) {
          setSuccess('Tipo eliminado exitosamente')
          loadTipos()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError('Error al eliminar tipo')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      imagen: null
    })
    setImagePreview('')
    setEditingTipo(null)
  }

  return (
    <div className="fo-tipo-container">
      <div className="fo-tipo-header">
        <h2>{editingTipo ? 'Editar Tipo' : 'Agregar Nuevo Tipo'}</h2>
        {editingTipo && (
          <button onClick={resetForm} className="btn-cancel">
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Formulario */}
      <div className="fo-tipo-form-container">
        <form onSubmit={handleSubmit} className="fo-tipo-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre del Tipo:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Ej: Agua, Fuego, Planta..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen del Tipo:</label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              onChange={handleFileChange}
              accept="image/*"
              disabled={loading}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Procesando...' : editingTipo ? 'Actualizar Tipo' : 'Crear Tipo'}
          </button>
        </form>
      </div>

      {/* Lista de tipos */}
      <div className="fo-tipo-list-container">
        <h3>Tipos Existentes</h3>
        {loading && <div className="loading">Cargando tipos...</div>}
        
        <div className="tipos-grid">
          {Array.isArray(tipos) && tipos.map((tipo) => (
            <div key={tipo.id_tipo} className="tipo-card">
              <div className="tipo-image">
                {tipo.path ? (
                  <img 
                    src={`http://localhost:3001/${tipo.path}`} 
                    alt={tipo.nombre}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="tipo-info">
                <h4>{tipo.nombre}</h4>
                <p>ID: {tipo.id_tipo}</p>
                {tipo.file_name && <p className="filename">Archivo: {tipo.file_name}</p>}
              </div>
              <div className="tipo-actions">
                <button 
                  onClick={() => handleEdit(tipo)}
                  className="btn-edit"
                  disabled={loading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(tipo.id_tipo)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(tipos) && tipos.length === 0 && !loading && (
          <div className="no-tipos">No hay tipos registrados</div>
        )}
      </div>
    </div>
  )
}

export default FoTipo