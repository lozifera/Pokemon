import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import { equiposService } from '../services/equiposService'

export const useUserEquipos = () => {
  const { user } = useAuth()
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadUserEquipos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user?.id) {
        setEquipos([])
        return
      }

      const response = await equiposService.getUserEquipos(user.id)
      
      if (response.success) {
        setEquipos(response.data || [])
      } else {
        setError(response.message)
        setEquipos([])
      }
    } catch (err) {
      setError('Error al cargar equipos del usuario')
      setEquipos([])
      console.error('Error in useUserEquipos:', err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user) {
      loadUserEquipos()
    }
  }, [user, loadUserEquipos])

  const refreshEquipos = () => {
    loadUserEquipos()
  }

  const createEquipo = async (equipoData) => {
    try {
      const response = await equiposService.createEquipo({
        ...equipoData,
        id_usuario: user.id
      })
      
      if (response.success) {
        await loadUserEquipos() // Recargar la lista
      }
      
      return response
    } catch (error) {
      console.error('Error creating equipo:', error)
      return {
        success: false,
        message: 'Error al crear equipo'
      }
    }
  }

  const updateEquipo = async (equipoId, equipoData) => {
    try {
      const response = await equiposService.updateEquipo(equipoId, equipoData)
      
      if (response.success) {
        await loadUserEquipos() // Recargar la lista
      }
      
      return response
    } catch (error) {
      console.error('Error updating equipo:', error)
      return {
        success: false,
        message: 'Error al actualizar equipo'
      }
    }
  }

  const deleteEquipo = async (equipoId) => {
    try {
      const response = await equiposService.deleteEquipo(equipoId)
      
      if (response.success) {
        await loadUserEquipos() // Recargar la lista
      }
      
      return response
    } catch (error) {
      console.error('Error deleting equipo:', error)
      return {
        success: false,
        message: 'Error al eliminar equipo'
      }
    }
  }

  return {
    equipos,
    loading,
    error,
    refreshEquipos,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    totalEquipos: equipos.length
  }
}

export default useUserEquipos
