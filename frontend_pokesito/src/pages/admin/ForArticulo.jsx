import { useState, useEffect } from 'react'
import { articuloService } from '../../services/articuloService'
import '../../styles/ForArticulo.css'

function ForArticulo() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingArticulo, setEditingArticulo] = useState(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: null
  })
  const [imagePreview, setImagePreview] = useState('')

  // Cargar artículos al montar el componente
  useEffect(() => {
    loadArticulos()
  }, [])

  const loadArticulos = async () => {
    setLoading(true)
    try {
      const result = await articuloService.getAllArticulos()
      if (result.success) {
        const articulosData = result.data || []
        setArticulos(Array.isArray(articulosData) ? articulosData : [])
      } else {
        setError(result.message)
        setArticulos([])
      }
    } catch (error) {
      setError('Error al cargar artículos')
      setArticulos([])
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Validar longitud máxima
    if (name === 'nombre' && value.length > 255) {
      setError('El nombre no puede exceder los 255 caracteres')
      return
    }
    
    if (name === 'descripcion' && value.length > 255) {
      setError('La descripción no puede exceder los 255 caracteres')
      return
    }

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
      // Validar tipo de archivo
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos PNG, JPG o JPEG')
        e.target.value = ''
        return
      }
      
      // Validar tamaño de archivo (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setError('El archivo no puede ser mayor a 5MB')
        e.target.value = ''
        return
      }

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
      
      // Limpiar error si había uno
      if (error) setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre del artículo es requerido')
      setLoading(false)
      return
    }

    if (!formData.descripcion.trim()) {
      setError('La descripción del artículo es requerida')
      setLoading(false)
      return
    }

    if (!editingArticulo && !formData.imagen) {
      setError('La imagen es requerida para nuevos artículos')
      setLoading(false)
      return
    }

    try {
      let result
      if (editingArticulo) {
        // Actualizar artículo existente
        result = await articuloService.updateArticulo(editingArticulo.id_articulo, formData)
      } else {
        // Crear nuevo artículo
        result = await articuloService.createArticulo(formData)
      }

      if (result.success) {
        setSuccess(result.message)
        resetForm()
        loadArticulos() // Recargar la lista
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

  const handleEdit = (articulo) => {
    setEditingArticulo(articulo)
    setFormData({
      nombre: articulo.nombre || '',
      descripcion: articulo.descripcion || '',
      imagen: null
    })
    // Mostrar imagen actual si existe
    if (articulo.path) {
      setImagePreview(`http://localhost:3001/${articulo.path}`)
    }
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      setLoading(true)
      try {
        const result = await articuloService.deleteArticulo(id)
        if (result.success) {
          setSuccess('Artículo eliminado exitosamente')
          loadArticulos()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError('Error al eliminar artículo')
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      imagen: null
    })
    setImagePreview('')
    setEditingArticulo(null)
  }

  return (
    <div className="for-articulo-container">
      <div className="for-articulo-header">
        <h2>{editingArticulo ? 'Editar Artículo' : 'Agregar Nuevo Artículo'}</h2>
        {editingArticulo && (
          <button onClick={resetForm} className="btn-cancel">
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Formulario */}
      <div className="for-articulo-form-container">
        <form onSubmit={handleSubmit} className="for-articulo-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="nombre">
              Nombre del Artículo: <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              disabled={loading}
              maxLength="255"
              placeholder="Ej: Poción, Pokéball, Superapoz..."
            />
            <div className="char-count">
              {formData.nombre.length}/255 caracteres
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción: <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              disabled={loading}
              maxLength="255"
              placeholder="Descripción del artículo..."
              rows="4"
            />
            <div className="char-count">
              {formData.descripcion.length}/255 caracteres
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imagen">
              Imagen del Artículo: {!editingArticulo && <span className="required">*</span>}
            </label>
            <input
              type="file"
              id="imagen"
              name="imagen"
              onChange={handleFileChange}
              accept="image/png,image/jpg,image/jpeg"
              disabled={loading}
              required={!editingArticulo}
            />
            <div className="file-info">
              <small>Formatos permitidos: PNG, JPG, JPEG. Tamaño máximo: 5MB</small>
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Procesando...' : editingArticulo ? 'Actualizar Artículo' : 'Crear Artículo'}
          </button>
        </form>
      </div>

      {/* Lista de artículos */}
      <div className="for-articulo-list-container">
        <h3>Artículos Existentes</h3>
        {loading && <div className="loading">Cargando artículos...</div>}
        
        <div className="articulos-grid">
          {Array.isArray(articulos) && articulos.map((articulo) => (
            <div key={articulo.id_articulo} className="articulo-card">
              <div className="articulo-image">
                {articulo.path ? (
                  <img 
                    src={`http://localhost:3001/${articulo.path}`} 
                    alt={articulo.nombre}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="articulo-info">
                <h4>{articulo.nombre}</h4>
                <p className="articulo-id">ID: {articulo.id_articulo}</p>
                <p className="articulo-descripcion">{articulo.descripcion}</p>
                {articulo.file_name && <p className="filename">Archivo: {articulo.file_name}</p>}
              </div>
              <div className="articulo-actions">
                <button 
                  onClick={() => handleEdit(articulo)}
                  className="btn-edit"
                  disabled={loading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(articulo.id_articulo)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(articulos) && articulos.length === 0 && !loading && (
          <div className="no-articulos">No hay artículos registrados</div>
        )}
      </div>
    </div>
  )
}

export default ForArticulo
