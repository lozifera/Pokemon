import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import PrincipalClient from './pages/client/PrincipalClient'
import PrincipalAdmin from './pages/admin/PrincipalAdmin'
import FoTipo from './pages/admin/FoTipo'
import FoCat from './pages/admin/FoCat'
import ForMovimiento from './pages/admin/ForMovimiento'
import ForArticulo from './pages/admin/ForArticulo'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta principal - redirige a Login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Páginas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas para clientes */}
            <Route 
              path="/client" 
              element={
                <ProtectedRoute>
                  <PrincipalClient />
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas protegidas para administradores */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <PrincipalAdmin />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para gestionar tipos - solo admin */}
            <Route 
              path="/admin/tipos" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <FoTipo />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para gestionar categorías - solo admin */}
            <Route 
              path="/admin/categorias" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <FoCat />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para gestionar movimientos - solo admin */}
            <Route 
              path="/admin/movimientos" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ForMovimiento />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para gestionar artículos - solo admin */}
            <Route 
              path="/admin/articulos" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <ForArticulo />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta para páginas no encontradas - redirige a login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
