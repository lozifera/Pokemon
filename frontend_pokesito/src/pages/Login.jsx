import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import '../styles/Auth.css'

function Login() {
  const [formData, setFormData] = useState({
    correo: '',
    contraseña: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData)
      
      if (result.success) {
        console.log('Login exitoso:', result.data)
        
        // Redirigir según el tipo de usuario
        const usuario = result.data?.data?.usuario
        console.log('Usuario logueado:', usuario)
        
        if (usuario?.admin) {
          console.log('Redirigiendo a admin dashboard')
          navigate('/admin')
        } else {
          console.log('Redirigiendo a client dashboard')
          navigate('/client')
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError('Error de conexión. Intenta de nuevo.')
      console.error('Error en login:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="tu@email.com"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="contraseña">Contraseña:</label>
            <input
              type="password"
              id="contraseña"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Tu contraseña"
            />
          </div>
          
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        
        <p className="auth-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default Login