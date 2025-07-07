import { useState, useEffect } from 'react'
import { catService } from '../../services/catService'
import '../../styles/FoCat.css'

function FoCat() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingCategoria, setEditingCategoria] = useState(null)
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: null
  })
  const [imagePreview, setImagePreview] = useState('')

  // Cargar categorías al montar el componente
  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategorias = async () => {
    setLoading(true)
    try {
      const result = await catService.getAllCategorias()
      if (result.success) {
        // Asegurar que siempre tengamos un array
        const categoriasData = result.data || []
        setCategorias(Array.isArray(categoriasData) ? categoriasData : [])
      } else {
        setError(result.message)
        setCategorias([]) // Asegurar que sea un array vacío en caso de error
      }
    } catch (error) {
      setError('Error al cargar categorías')
      setCategorias([]) // Asegurar que sea un array vacío en caso de error
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

    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es requerido')
      setLoading(false)
      return
    }

    try {
      let result
      if (editingCategoria) {
        // Actualizar categoría existente
        result = await catService.updateCategoria(editingCategoria.id_cat, formData)
      } else {
        // Crear nueva categoría
        result = await catService.createCategoria(formData)
      }

      if (result.success) {
        setSuccess(result.message)
        resetForm()
        loadCategorias() // Recargar la lista
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

  const handleEdit = (categoria) => {
    setEditingCategoria(categoria)
    setFormData({
      nombre: categoria.nombre || '',
      imagen: null
    })
    // Mostrar imagen actual si existe
    if (categoria.path) {
      setImagePreview(`http://localhost:3001/${categoria.path}`)
    }
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      setLoading(true)
      try {
        const result = await catService.deleteCategoria(id)
        if (result.success) {
          setSuccess('Categoría eliminada exitosamente')
          loadCategorias()
        } else {
          setError(result.message)
        }
      } catch (error) {
        setError('Error al eliminar categoría')
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
    setEditingCategoria(null)
  }

  return (
    <div className="fo-cat-container">
      <div className="fo-cat-header">
        <h2>{editingCategoria ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h2>
        {editingCategoria && (
          <button onClick={resetForm} className="btn-cancel">
            Cancelar Edición
          </button>
        )}
      </div>

      {/* Formulario */}
      <div className="fo-cat-form-container">
        <form onSubmit={handleSubmit} className="fo-cat-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Categoría:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              disabled={loading}
              placeholder="Ej: Legendario, Mítico, Común..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="imagen">Imagen de la Categoría:</label>
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
            {loading ? 'Procesando...' : editingCategoria ? 'Actualizar Categoría' : 'Crear Categoría'}
          </button>
        </form>
      </div>

      {/* Lista de categorías */}
      <div className="fo-cat-list-container">
        <h3>Categorías Existentes</h3>
        {loading && <div className="loading">Cargando categorías...</div>}
        
        <div className="categorias-grid">
          {Array.isArray(categorias) && categorias.map((categoria) => (
            <div key={categoria.id_cat} className="categoria-card">
              <div className="categoria-image">
                {categoria.path ? (
                  <img 
                    src={`http://localhost:3001/${categoria.path}`} 
                    alt={categoria.nombre}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="no-image">Sin imagen</div>
                )}
              </div>
              <div className="categoria-info">
                <h4>{categoria.nombre}</h4>
                <p className="categoria-id">ID: {categoria.id_cat}</p>
                {categoria.file_name && <p className="filename">Archivo: {categoria.file_name}</p>}
              </div>
              <div className="categoria-actions">
                <button 
                  onClick={() => handleEdit(categoria)}
                  className="btn-edit"
                  disabled={loading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(categoria.id_cat)}
                  className="btn-delete"
                  disabled={loading}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {Array.isArray(categorias) && categorias.length === 0 && !loading && (
          <div className="no-categorias">No hay categorías registradas</div>
        )}
      </div>
    </div>
  )
}

export default FoCat