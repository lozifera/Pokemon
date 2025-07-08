import React, { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useUserEquipos } from '../../hooks/useUserEquipos'
import { equipoPokemonService } from '../../services/equiposService'
import { pokemonService } from '../../services/pokemonService'
import { estadisticasService } from '../../services/estadisticasService'
import { userUtils } from '../../utils/userUtils'
import '../../styles/TeamBuilder.css'

const TeamBuilder = () => {
  const { user } = useAuth()
  const { 
    equipos, 
    createEquipo, 
    deleteEquipo
  } = useUserEquipos()
  
  const [selectedEquipo, setSelectedEquipo] = useState(null)
  const [equipoPokemon, setEquipoPokemon] = useState([])
  const [pokemonDisponibles, setPokemonDisponibles] = useState([])
  const [loading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showPokemonSelector, setShowPokemonSelector] = useState(false)
  const [showPokemonEditor, setShowPokemonEditor] = useState(false)
  const [selectedPokemonForEdit, setSelectedPokemonForEdit] = useState(null)
  const [nuevoEquipoNombre, setNuevoEquipoNombre] = useState('')
  const [pokemonSearchTerm, setPokemonSearchTerm] = useState('')
  const [naturalezasDisponibles, setNaturalezasDisponibles] = useState([])
  const [selectedPokemonBaseStats, setSelectedPokemonBaseStats] = useState(null)
  const [loadingBaseStats, setLoadingBaseStats] = useState(false)
  const [pokemonMovimientos, setPokemonMovimientos] = useState([])
  const [pokemonHabilidades, setPokemonHabilidades] = useState([])
  const [pokemonArticulos, setPokemonArticulos] = useState([])
  const [loadingMovimientos, setLoadingMovimientos] = useState(false)
  const [loadingHabilidades, setLoadingHabilidades] = useState(false)
  const [loadingArticulos, setLoadingArticulos] = useState(false)

  // Estados para el editor de Pokémon
  const [pokemonEditData, setPokemonEditData] = useState({
    apodo_pok: '',
    nivel: 50,
    experiencia: 0,
    // IVs (Individual Values)
    iv_hp: 31,
    iv_ataque: 31,
    iv_defensa: 31,
    iv_ataque_especial: 31,
    iv_defensa_especial: 31,
    iv_velocidad: 31,
    // EVs (Effort Values)
    ev_hp: 0,
    ev_ataque: 0,
    ev_defensa: 0,
    ev_ataque_especial: 0,
    ev_defensa_especial: 0,
    ev_velocidad: 0,
    // Otros campos
    naturaleza: 'Hardy',
    id_habilidad: null,
    id_articulo: null,
    // Movimientos (hasta 4)
    movimientos: [null, null, null, null]
  })

  // Debug: Mostrar información del usuario y equipos
  useEffect(() => {
    console.log('TeamBuilder - Usuario actual:', user)
    console.log('TeamBuilder - ID de usuario:', user?.id_usuario || user?.id)
    console.log('TeamBuilder - Nombre de usuario:', user?.nombre_usuario || user?.nombre)
    console.log('TeamBuilder - Equipos cargados:', equipos)
    console.log('TeamBuilder - Naturalezas disponibles:', naturalezasDisponibles)
    console.log('TeamBuilder - Movimientos disponibles:', pokemonMovimientos)
    console.log('TeamBuilder - Habilidades disponibles:', pokemonHabilidades)
    console.log('TeamBuilder - Artículos disponibles:', pokemonArticulos)
    console.log('TeamBuilder - Debug completo:', userUtils.getUserDebugInfo())
  }, [user, equipos, naturalezasDisponibles, pokemonMovimientos, pokemonHabilidades, pokemonArticulos])

  // Cargar Pokémon disponibles al montar el componente
  useEffect(() => {
    loadPokemonDisponibles()
    loadNaturalezasDisponibles()
    loadPokemonArticulos() // Cargar artículos una sola vez al inicio
  }, [])

  // Cargar Pokémon del equipo cuando se selecciona un equipo
  useEffect(() => {
    if (selectedEquipo) {
      loadEquipoPokemon(selectedEquipo.id_equipo)
    }
  }, [selectedEquipo])

  // Funciones para equipos - ahora usando el hook
  const handleCreateEquipo = async () => {
    if (!nuevoEquipoNombre.trim()) {
      alert('Por favor ingresa un nombre para el equipo')
      return
    }

    try {
      const result = await createEquipo({
        nombre: nuevoEquipoNombre.trim()
      })
      
      if (result.success) {
        setNuevoEquipoNombre('')
        setShowCreateForm(false)
        alert('Equipo creado exitosamente')
      } else {
        alert(result.message || 'Error al crear el equipo')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear el equipo')
    }
  }

  const handleDeleteEquipo = async (equipoId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      return
    }

    try {
      const result = await deleteEquipo(equipoId)
      
      if (result.success) {
        // Si el equipo eliminado era el seleccionado, limpiar la selección
        if (selectedEquipo?.id_equipo === equipoId) {
          setSelectedEquipo(null)
          setEquipoPokemon([])
        }
        alert('Equipo eliminado exitosamente')
      } else {
        alert(result.message || 'Error al eliminar el equipo')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el equipo')
    }
  }

  const loadEquipoPokemon = async (equipoId) => {
    try {
      console.log('loadEquipoPokemon: Cargando pokemon para equipo:', equipoId)
      const result = await equipoPokemonService.getEquipoPokemon(equipoId)
      if (result.success) {
        console.log('loadEquipoPokemon: Respuesta completa:', result)
        console.log('loadEquipoPokemon: Datos de Pokémon:', result.data)
        console.log('loadEquipoPokemon: Información del equipo:', result.equipo)
        console.log('loadEquipoPokemon: Total de Pokémon:', result.total)
        
        // Imprimir los primeros pokemon para debugging
        if (result.data && result.data.length > 0) {
          console.log('loadEquipoPokemon: Primer pokemon:', result.data[0])
        }
        setEquipoPokemon(Array.isArray(result.data) ? result.data : [])
      } else {
        console.error('Error al cargar Pokémon del equipo:', result.message)
        setEquipoPokemon([])
      }
    } catch (error) {
      console.error('Error:', error)
      setEquipoPokemon([])
    }
  }

  const loadPokemonDisponibles = async () => {
    try {
      console.log('loadPokemonDisponibles: Cargando pokemon disponibles')
      const result = await pokemonService.getAllPokemon()
      if (result.success) {
        console.log('loadPokemonDisponibles: Datos recibidos:', result.data)
        // Imprimir los primeros pokemon para debugging
        if (result.data && result.data.length > 0) {
          console.log('loadPokemonDisponibles: Primer pokemon:', result.data[0])
        }
        setPokemonDisponibles(Array.isArray(result.data) ? result.data : [])
      } else {
        console.error('Error al cargar Pokémon disponibles:', result.message)
        setPokemonDisponibles([])
      }
    } catch (error) {
      console.error('Error:', error)
      setPokemonDisponibles([])
    }
  }

  const loadNaturalezasDisponibles = async () => {
    try {
      console.log('loadNaturalezasDisponibles: Cargando naturalezas disponibles')
      const response = await fetch('http://localhost:3001/api/naturalezas')
      const result = await response.json()
      
      if (result.exito) {
        console.log('loadNaturalezasDisponibles: Datos recibidos:', result.datos)
        setNaturalezasDisponibles(Array.isArray(result.datos) ? result.datos : [])
      } else {
        console.error('Error al cargar naturalezas:', result.mensaje)
        setNaturalezasDisponibles([])
      }
    } catch (error) {
      console.error('Error al cargar naturalezas:', error)
      setNaturalezasDisponibles([])
    }
  }

  const loadPokemonBaseStats = async (pokemonId) => {
    try {
      console.log('loadPokemonBaseStats: Cargando estadísticas base del Pokémon ID:', pokemonId)
      setLoadingBaseStats(true)
      const response = await fetch(`http://localhost:3001/api/pokemon/${pokemonId}`)
      const result = await response.json()
      
      if (result.exito) {
        console.log('loadPokemonBaseStats: Datos recibidos:', result.datos)
        const baseStats = {
          HP: result.datos.HP || 50,
          ataque: result.datos.ataque || 50,
          defensa: result.datos.defensa || 50,
          sp_ataque: result.datos.sp_ataque || 50,
          sp_defensa: result.datos.sp_defensa || 50,
          velocidad: result.datos.velocidad || 50
        }
        setSelectedPokemonBaseStats(baseStats)
        setLoadingBaseStats(false)
        return baseStats
      } else {
        console.error('Error al cargar estadísticas base:', result.mensaje)
        const defaultStats = { HP: 50, ataque: 50, defensa: 50, sp_ataque: 50, sp_defensa: 50, velocidad: 50 }
        setSelectedPokemonBaseStats(defaultStats)
        setLoadingBaseStats(false)
        return defaultStats
      }
    } catch (error) {
      console.error('Error al cargar estadísticas base:', error)
      const defaultStats = { HP: 50, ataque: 50, defensa: 50, sp_ataque: 50, sp_defensa: 50, velocidad: 50 }
      setSelectedPokemonBaseStats(defaultStats)
      setLoadingBaseStats(false)
      return defaultStats
    }
  }

  const loadPokemonMovimientos = async (pokemonId) => {
    try {
      console.log('loadPokemonMovimientos: Cargando movimientos del Pokémon ID:', pokemonId)
      setLoadingMovimientos(true)
      const response = await fetch(`http://localhost:3001/api/pokemon/${pokemonId}/movimientos`)
      const result = await response.json()
      
      if (result.exito) {
        console.log('loadPokemonMovimientos: Datos recibidos:', result.datos)
        setPokemonMovimientos(Array.isArray(result.datos) ? result.datos : [])
      } else {
        console.error('Error al cargar movimientos:', result.mensaje)
        setPokemonMovimientos([])
      }
      setLoadingMovimientos(false)
    } catch (error) {
      console.error('Error al cargar movimientos:', error)
      setPokemonMovimientos([])
      setLoadingMovimientos(false)
    }
  }

  const loadPokemonHabilidades = async (pokemonId) => {
    try {
      console.log('loadPokemonHabilidades: Cargando habilidades del Pokémon ID:', pokemonId)
      setLoadingHabilidades(true)
      const response = await fetch(`http://localhost:3001/api/pokemon/${pokemonId}/habilidades`)
      const result = await response.json()
      
      if (result.exito) {
        console.log('loadPokemonHabilidades: Datos recibidos:', result.datos)
        setPokemonHabilidades(Array.isArray(result.datos) ? result.datos : [])
      } else {
        console.error('Error al cargar habilidades:', result.mensaje)
        setPokemonHabilidades([])
      }
      setLoadingHabilidades(false)
    } catch (error) {
      console.error('Error al cargar habilidades:', error)
      setPokemonHabilidades([])
      setLoadingHabilidades(false)
    }
  }

  const loadPokemonArticulos = async () => {
    try {
      console.log('loadPokemonArticulos: Cargando artículos disponibles')
      setLoadingArticulos(true)
      const response = await fetch(`http://localhost:3001/api/articulos`)
      const result = await response.json()
      
      if (result.exito) {
        console.log('loadPokemonArticulos: Datos recibidos:', result.datos)
        setPokemonArticulos(Array.isArray(result.datos) ? result.datos : [])
      } else {
        console.error('Error al cargar artículos:', result.mensaje)
        setPokemonArticulos([])
      }
      setLoadingArticulos(false)
    } catch (error) {
      console.error('Error al cargar artículos:', error)
      setPokemonArticulos([])
      setLoadingArticulos(false)
    }
  }

  // Función para obtener la URL correcta de la imagen
  const getImageUrl = (pokemon) => {
    if (!pokemon) {
      return '/pokemon-placeholder.svg'
    }
    
    // Si tiene img_pok y NO es el placeholder, usarlo
    if (pokemon.img_pok && pokemon.img_pok !== '/pokemon-placeholder.svg') {
      // Si ya es una URL completa, usarla tal como está
      if (pokemon.img_pok.startsWith('http')) {
        return pokemon.img_pok
      }
      // Si es una ruta relativa, construir la URL completa (similar a FoTipo)
      const fullUrl = `http://localhost:3001/${pokemon.img_pok}`
      return fullUrl
    }
    
    // Si tiene path, construir la URL completa
    if (pokemon.path) {
      const fullUrl = `http://localhost:3001/${pokemon.path}`
      return fullUrl
    }
    
    // Si tiene imagen, construir la URL completa
    if (pokemon.imagen) {
      if (pokemon.imagen.startsWith('http')) {
        return pokemon.imagen
      }
      const fullUrl = `http://localhost:3001/${pokemon.imagen}`
      return fullUrl
    }
    
    // Si tiene image, construir la URL completa
    if (pokemon.image) {
      if (pokemon.image.startsWith('http')) {
        return pokemon.image
      }
      const fullUrl = `http://localhost:3001/${pokemon.image}`
      return fullUrl
    }
    
    // Si llegamos aquí, buscar en pokemonDisponibles por el nombre
    if (pokemon.nombre_pok && pokemonDisponibles.length > 0) {
      const pokemonCompleto = pokemonDisponibles.find(p => p.nombre_pok === pokemon.nombre_pok)
      if (pokemonCompleto && pokemonCompleto.path) {
        const fullUrl = `http://localhost:3001/${pokemonCompleto.path}`
        return fullUrl
      }
    }
    
    // Fallback al placeholder
    return '/pokemon-placeholder.svg'
  }

  // Función para abrir el editor de Pokémon
  const openPokemonEditor = async (pokemon) => {
    setSelectedPokemonForEdit(pokemon)
    
    // Cargar las estadísticas base del Pokémon
    // Intentar obtener el ID del Pokémon de diferentes formas
    let pokemonId = pokemon.id_pokemon || pokemon.id || null
    
    // Si no tenemos ID, buscar por nombre en la lista de pokemonDisponibles
    if (!pokemonId && pokemon.nombre_pok && pokemonDisponibles.length > 0) {
      const pokemonCompleto = pokemonDisponibles.find(p => p.nombre_pok === pokemon.nombre_pok)
      if (pokemonCompleto) {
        pokemonId = pokemonCompleto.id_pokemon || pokemonCompleto.id
      }
    }
    
    console.log('openPokemonEditor - Pokémon data:', pokemon)
    console.log('openPokemonEditor - ID encontrado:', pokemonId)
    
    if (pokemonId) {
      // Cargar datos específicos del Pokémon en paralelo
      await Promise.all([
        loadPokemonBaseStats(pokemonId),
        loadPokemonMovimientos(pokemonId),
        loadPokemonHabilidades(pokemonId)
        // Los artículos se cargan una sola vez al inicio
      ])
    } else {
      console.warn('No se pudo encontrar el ID del Pokémon:', pokemon.nombre_pok)
    }
    
    // Determinar la naturaleza inicial
    let initialNature = pokemon.naturaleza || 'Hardy'
    
    // Si las naturalezas están cargadas y la naturaleza inicial no existe, usar la primera
    if (naturalezasDisponibles.length > 0) {
      const natureExists = naturalezasDisponibles.find(n => n.nombre === initialNature)
      if (!natureExists) {
        initialNature = naturalezasDisponibles[0].nombre
      }
    }
    
    setPokemonEditData({
      apodo_pok: pokemon.apodo_pok || pokemon.nombre_pok,
      nivel: pokemon.nivel || 50,
      experiencia: pokemon.experiencia || 0,
      // IVs
      iv_hp: pokemon.iv_hp || 31,
      iv_ataque: pokemon.iv_ataque || 31,
      iv_defensa: pokemon.iv_defensa || 31,
      iv_ataque_especial: pokemon.iv_ataque_especial || 31,
      iv_defensa_especial: pokemon.iv_defensa_especial || 31,
      iv_velocidad: pokemon.iv_velocidad || 31,
      // EVs
      ev_hp: pokemon.ev_hp || 0,
      ev_ataque: pokemon.ev_ataque || 0,
      ev_defensa: pokemon.ev_defensa || 0,
      ev_ataque_especial: pokemon.ev_ataque_especial || 0,
      ev_defensa_especial: pokemon.ev_defensa_especial || 0,
      ev_velocidad: pokemon.ev_velocidad || 0,
      // Otros
      naturaleza: initialNature,
      id_habilidad: pokemon.id_habilidad || null,
      id_articulo: pokemon.id_articulo || null,
      // Movimientos (hasta 4)
      movimientos: pokemon.movimientos || [null, null, null, null]
    })
    setShowPokemonEditor(true)
  }

  // Función para cerrar el modal y limpiar estados
  const closePokemonEditor = () => {
    setShowPokemonEditor(false)
    setSelectedPokemonForEdit(null)
    setSelectedPokemonBaseStats(null)
    setLoadingBaseStats(false)
    setPokemonMovimientos([])
    setPokemonHabilidades([])
    setPokemonArticulos([])
    setLoadingMovimientos(false)
    setLoadingHabilidades(false)
    setLoadingArticulos(false)
  }

  // Función para guardar los cambios del Pokémon editado
  const savePokemonEdit = async () => {
    if (!selectedPokemonForEdit) return

    try {
      console.log('=== INICIANDO FLUJO COMPLETO DE ESTADÍSTICAS ===')
      
      // PASO 1: Crear IVs
      const ivsData = {
        HP: pokemonEditData.iv_hp,
        ataque: pokemonEditData.iv_ataque,
        defensa: pokemonEditData.iv_defensa,
        sp_ataque: pokemonEditData.iv_ataque_especial,
        sp_defensa: pokemonEditData.iv_defensa_especial,
        velocidad: pokemonEditData.iv_velocidad
      }
      
      const ivsResult = await estadisticasService.createIVs(ivsData)
      if (!ivsResult.success) {
        alert('Error al crear IVs: ' + ivsResult.message)
        return
      }
      
      const id_ivs = ivsResult.data.id || ivsResult.data.id_ivs
      console.log('✅ IVs creados con ID:', id_ivs)

      // PASO 2: Crear EVs
      const evsData = {
        HP: pokemonEditData.ev_hp,
        ataque: pokemonEditData.ev_ataque,
        defensa: pokemonEditData.ev_defensa,
        sp_ataque: pokemonEditData.ev_ataque_especial,
        sp_defensa: pokemonEditData.ev_defensa_especial,
        velocidad: pokemonEditData.ev_velocidad
      }
      
      const evsResult = await estadisticasService.createEVs(evsData)
      if (!evsResult.success) {
        alert('Error al crear EVs: ' + evsResult.message)
        return
      }
      
      const id_evs = evsResult.data.id || evsResult.data.id_evs
      console.log('✅ EVs creados con ID:', id_evs)

      // PASO 3: Encontrar la naturaleza existente
      const selectedNature = naturalezasDisponibles.find(n => n.nombre === pokemonEditData.naturaleza)
      if (!selectedNature) {
        alert('Error: Naturaleza no encontrada: ' + pokemonEditData.naturaleza)
        return
      }
      
      const id_naturaleza = selectedNature.id_naturaleza
      console.log('✅ Naturaleza encontrada:', selectedNature.nombre, 'con ID:', id_naturaleza)

      // PASO 4: Calcular y crear Estadísticas finales
      // Usar las estadísticas base reales del Pokémon o valores por defecto
      const baseStats = selectedPokemonBaseStats || {
        HP: 98,  // Valores por defecto si no se pudieron cargar
        ataque: 87,
        defensa: 105,
        sp_ataque: 53,
        sp_defensa: 85,
        velocidad: 67
      }
      
      console.log('📊 Usando estadísticas base:', baseStats)
      
      // Calcular estadísticas finales usando la naturaleza seleccionada
      const finalStats = estadisticasService.calculateFinalStats(
        baseStats,
        ivsData,
        evsData,
        pokemonEditData.nivel,
        selectedNature.nombre
      )
      
      const estadisticasData = {
        HP: finalStats.HP,
        ataque: finalStats.ataque,
        defensa: finalStats.defensa,
        sp_ataque: finalStats.sp_ataque,
        sp_defensa: finalStats.sp_defensa,
        velocidad: finalStats.velocidad,
        id_evs: id_evs,
        id_ivs: id_ivs,
        id_naturaleza: id_naturaleza
      }
      
      const estadisticasResult = await estadisticasService.createEstadisticas(estadisticasData)
      if (!estadisticasResult.success) {
        alert('Error al crear Estadísticas: ' + estadisticasResult.message)
        return
      }
      
      const id_estadisticas = estadisticasResult.data.id || estadisticasResult.data.id_estadisticas
      console.log('✅ Estadísticas creadas con ID:', id_estadisticas)

      // PASO 5: Actualizar Pokémon en equipo usando PATCH
      const updateData = {
        apodo_pok: pokemonEditData.apodo_pok,
        nivel: pokemonEditData.nivel,
        experiencia: pokemonEditData.experiencia,
        id_estadisticas: id_estadisticas
      }

      console.log('=== ACTUALIZANDO POKÉMON EN EQUIPO ===')
      console.log('ID del Pokémon en equipo:', selectedPokemonForEdit.id_equipo_pokemon)
      console.log('Datos finales para actualizar:', updateData)
      
      const result = await estadisticasService.updateEquipoPokemon(
        selectedPokemonForEdit.id_equipo_pokemon, 
        updateData
      )

      if (result.success) {
        alert('🎉 Pokémon actualizado exitosamente con todas las estadísticas!')
        closePokemonEditor()
        loadEquipoPokemon(selectedEquipo.id_equipo)
        
        console.log('=== FLUJO COMPLETADO EXITOSAMENTE ===')
        console.log('IVs ID:', id_ivs)
        console.log('EVs ID:', id_evs)
        console.log('Naturaleza ID:', id_naturaleza)
        console.log('Estadísticas ID:', id_estadisticas)
        console.log('Estadísticas finales:', finalStats)
      } else {
        alert('Error al actualizar Pokémon: ' + result.message)
        console.error('Error detallado:', result)
      }
    } catch (error) {
      console.error('Error en savePokemonEdit:', error)
      alert('Error al actualizar Pokémon: ' + error.message)
    }
  }
  const testEquipoPokemonEndpoint = async () => {
    console.log('=== PROBANDO ENDPOINT equipo-pokemon ===')
    
    if (!selectedEquipo) {
      console.log('Error: No hay equipo seleccionado')
      return
    }

    const testData = {
      id_equipo: selectedEquipo.id_equipo,
      id_pokemon: 1, // ID básico para prueba
      nombre_pok: 'Test Pokemon',
      apodo_pok: 'Test Pokemon',
      img_pok: '/pokemon-placeholder.svg',
      id_detalle: null,
      id_articulo: null,
      id_estadisticas: null,
      id_habilidad: null
    }

    try {
      console.log('Enviando datos de prueba:', testData)
      const result = await equipoPokemonService.addPokemonToEquipo(testData)
      console.log('Resultado de prueba:', result)
    } catch (error) {
      console.error('Error en prueba:', error)
    }
    
    console.log('=== FIN DE PRUEBA ===')
  }

  const handleSelectEquipo = (equipo) => {
    setSelectedEquipo(equipo)
    setShowPokemonSelector(false)
    setPokemonSearchTerm('') // Limpiar búsqueda al cerrar
  }

  const handleAddPokemonToEquipo = async (pokemon) => {
    if (!selectedEquipo) {
      alert('Selecciona un equipo primero')
      return
    }

    if (equipoPokemon.length >= 6) {
      alert('Un equipo no puede tener más de 6 Pokémon')
      return
    }

    try {
      // Intentar diferentes estructuras de datos para ver cuál funciona
      const pokemonDataOptions = [
        // Opción 1: Estructura completa con campos null
        {
          id_equipo: selectedEquipo.id_equipo,
          nombre_pok: pokemon.nombre_pok,
          apodo_pok: pokemon.nombre_pok,
          img_pok: getImageUrl(pokemon),
          id_pokemon: pokemon.id_pokemon,
          id_detalle: null,
          id_articulo: null,
          id_estadisticas: null,
          id_habilidad: null
        },
        // Opción 2: Estructura mínima
        {
          id_equipo: selectedEquipo.id_equipo,
          id_pokemon: pokemon.id_pokemon,
          nombre_pok: pokemon.nombre_pok,
          apodo_pok: pokemon.nombre_pok
        },
        // Opción 3: Con campos requeridos típicos
        {
          id_equipo: selectedEquipo.id_equipo,
          id_pokemon: pokemon.id_pokemon,
          nombre_pok: pokemon.nombre_pok,
          apodo_pok: pokemon.nombre_pok,
          img_pok: getImageUrl(pokemon),
          nivel: 50, // Nivel por defecto
          experiencia: 0 // Experiencia por defecto
        }
      ]

      const pokemonData = pokemonDataOptions[0] // Empezar con la primera opción

      console.log('=== AGREGANDO POKÉMON AL EQUIPO ===')
      console.log('Pokémon seleccionado:', pokemon)
      console.log('Equipo seleccionado:', selectedEquipo)
      console.log('Datos a enviar:', pokemonData)
      console.log('====================================')

      const result = await equipoPokemonService.addPokemonToEquipo(pokemonData)
      
      console.log('=== RESULTADO DEL SERVIDOR ===')
      console.log('Result:', result)
      console.log('==============================')

      if (result.success) {
        alert('Pokémon agregado al equipo exitosamente')
        loadEquipoPokemon(selectedEquipo.id_equipo)
        setShowPokemonSelector(false)
        setPokemonSearchTerm('') // Limpiar búsqueda al agregar exitosamente
      } else {
        alert('Error al agregar Pokémon: ' + result.message)
        console.error('Error detallado:', result)
        
        // Mostrar sugerencias de debug
        console.log('=== SUGERENCIAS DE DEBUG ===')
        console.log('1. Verificar que estos campos existen en la base de datos:')
        console.log('   - id_equipo:', selectedEquipo.id_equipo)
        console.log('   - id_pokemon:', pokemon.id_pokemon)
        console.log('2. Verificar que el endpoint /equipo-pokemon acepta POST')
        console.log('3. Verificar que el usuario tiene permisos para agregar Pokémon')
        console.log('4. Estructuras alternativas a probar:', pokemonDataOptions)
        console.log('============================')
      }
    } catch (error) {
      console.error('Error catch:', error)
      alert('Error al agregar Pokémon al equipo')
    }
  }

  const handleRemovePokemonFromEquipo = async (pokemonId) => {
    if (window.confirm('¿Estás seguro de que quieres quitar este Pokémon del equipo?')) {
      try {
        const result = await equipoPokemonService.removePokemonFromEquipo(pokemonId)
        if (result.success) {
          alert('Pokémon eliminado del equipo exitosamente')
          loadEquipoPokemon(selectedEquipo.id_equipo)
        } else {
          alert('Error al eliminar Pokémon: ' + result.message)
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar Pokémon del equipo')
      }
    }
  }

  // Filtrar Pokémon disponibles según el término de búsqueda
  const filteredPokemonDisponibles = pokemonDisponibles.filter(pokemon =>
    pokemon.nombre_pok?.toLowerCase().includes(pokemonSearchTerm.toLowerCase())
  )

  return (
    <div className="team-builder-container">
      <div className="team-builder-header">
        <h2>🎮 Constructor de Equipos Pokémon</h2>
        <p>Crea y gestiona tus equipos competitivos</p>
        <div className="user-welcome" style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
          <p>👋 Bienvenido, <strong>{user?.nombre || 'Usuario'}</strong>!</p>
          <p>💡 Todos los usuarios pueden crear equipos y agregar Pokémon</p>
        </div>
      </div>

      <div className="team-builder-content">
        {/* Panel izquierdo - Lista de equipos */}
        <div className="teams-panel">
          <div className="teams-header">
            <h3>Mis Equipos</h3>
            <button 
              className="btn-create-team"
              onClick={() => setShowCreateForm(!showCreateForm)}
              disabled={loading}
            >
              + Nuevo Equipo
            </button>
          </div>

          {showCreateForm && (
            <form onSubmit={handleCreateEquipo} className="create-team-form">
              <input
                type="text"
                placeholder="Nombre del equipo"
                value={nuevoEquipoNombre}
                onChange={(e) => setNuevoEquipoNombre(e.target.value)}
                disabled={loading}
                required
              />
              <div className="form-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateForm(false)
                    setNuevoEquipoNombre('')
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="teams-list">
            {loading ? (
              <div className="loading">Cargando equipos...</div>
            ) : equipos.length === 0 ? (
              <div className="no-teams">
                <p>No tienes equipos creados</p>
                <p>¡Crea tu primer equipo!</p>
              </div>
            ) : (
              equipos.map(equipo => (
                <div 
                  key={equipo.id_equipo} 
                  className={`team-item ${selectedEquipo?.id_equipo === equipo.id_equipo ? 'selected' : ''}`}
                  onClick={() => handleSelectEquipo(equipo)}
                >
                  <div className="team-info">
                    <h4>{equipo.nombre}</h4>
                    <small>Creado: {new Date(equipo.fecha_creacion || Date.now()).toLocaleDateString()}</small>
                  </div>
                  <button
                    className="btn-delete-team"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteEquipo(equipo.id_equipo)
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho - Equipo seleccionado */}
        <div className="team-detail-panel">
          {!selectedEquipo ? (
            <div className="no-team-selected">
              <h3>Selecciona un equipo</h3>
              <p>Elige un equipo de la lista para ver y editar sus Pokémon</p>
              {/* Debug info */}
              <div className="debug-info" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', fontSize: '12px' }}>
                <p><strong>Usuario:</strong> {user?.nombre || 'No disponible'}</p>
                <p><strong>ID Usuario:</strong> {user?.id_usuario || user?.id || 'No disponible'}</p>
                <p><strong>Correo:</strong> {user?.correo || 'No disponible'}</p>
                <p><strong>Admin:</strong> {user?.admin ? 'Sí' : 'No'}</p>
                <p><strong>Token:</strong> {localStorage.getItem('token') ? 'Presente' : 'No disponible'}</p>
                <p><strong>Válido:</strong> {userUtils.isUserValid(user) ? 'Sí' : 'No'}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="team-detail-header">
                <h3>{selectedEquipo.nombre}</h3>
                <div className="team-actions">
                  <button
                    className="btn-add-pokemon"
                    onClick={() => setShowPokemonSelector(!showPokemonSelector)}
                    disabled={equipoPokemon.length >= 6}
                  >
                    {equipoPokemon.length >= 6 ? 'Equipo Completo' : '+ Agregar Pokémon'}
                  </button>
                  <button
                    className="btn-test-endpoint"
                    onClick={testEquipoPokemonEndpoint}
                    style={{ 
                      marginLeft: '10px', 
                      padding: '8px 16px', 
                      backgroundColor: '#28a745', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🔧 Probar Endpoint
                  </button>
                </div>
              </div>

              {/* Pokémon Selector */}
              {showPokemonSelector && (
                <div className="pokemon-selector">
                  <h4>Selecciona un Pokémon ({filteredPokemonDisponibles.length} disponibles)</h4>
                  
                  {/* Input de búsqueda */}
                  <div className="pokemon-search-section">
                    <input
                      type="text"
                      placeholder="Buscar Pokémon por nombre..."
                      value={pokemonSearchTerm}
                      onChange={(e) => setPokemonSearchTerm(e.target.value)}
                      className="pokemon-search-input"
                    />
                  </div>

                  <div className="pokemon-grid">
                    {filteredPokemonDisponibles.map(pokemon => (
                      <div 
                        key={pokemon.id_pokemon}
                        className="pokemon-card"
                        onClick={() => handleAddPokemonToEquipo(pokemon)}
                      >
                        <img 
                          src={getImageUrl(pokemon)} 
                          alt={pokemon.nombre_pok}
                          onError={(e) => {
                            console.log('Error cargando imagen:', getImageUrl(pokemon))
                            e.target.src = '/pokemon-placeholder.svg'
                          }}
                        />
                        <span>{pokemon.nombre_pok}</span>
                      </div>
                    ))}
                  </div>
                  
                  {filteredPokemonDisponibles.length === 0 && pokemonSearchTerm && (
                    <div className="no-pokemon-found">
                      No se encontraron Pokémon con "{pokemonSearchTerm}"
                    </div>
                  )}
                </div>
              )}

              {/* Pokémon del equipo */}
              <div className="team-pokemon">
                <div className="pokemon-slots">
                  {[...Array(6)].map((_, index) => {
                    const pokemon = equipoPokemon[index]
                    return (
                      <div key={index} className="pokemon-slot">
                        {pokemon ? (
                          <div className="pokemon-in-team">
                            <img 
                              src={getImageUrl(pokemon)} 
                              alt={pokemon.nombre_pok}
                              onError={(e) => {
                                console.log('Error cargando imagen del equipo:', getImageUrl(pokemon))
                                e.target.src = '/pokemon-placeholder.svg'
                              }}
                            />
                            <div className="pokemon-info">
                              <h4>{pokemon.apodo_pok || pokemon.nombre_pok}</h4>
                              <small>{pokemon.nombre_pok}</small>
                              <div className="pokemon-actions">
                                <button
                                  className="btn-edit-pokemon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openPokemonEditor(pokemon)
                                  }}
                                  style={{ 
                                    marginRight: '5px', 
                                    padding: '4px 8px', 
                                    backgroundColor: '#007bff', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    fontSize: '12px'
                                  }}
                                >
                                  ⚙️ Editar
                                </button>
                                <button
                                  className="btn-remove-pokemon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemovePokemonFromEquipo(pokemon.id_equipo_pokemon)
                                  }}
                                  style={{ 
                                    padding: '4px 8px', 
                                    backgroundColor: '#dc3545', 
                                    color: 'white', 
                                    border: 'none', 
                                    borderRadius: '3px',
                                    fontSize: '12px'
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="empty-slot">
                            <span>Slot vacío</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal del Editor de Pokémon */}
      {showPokemonEditor && selectedPokemonForEdit && (
        <div className="pokemon-editor-modal">
          <div className="pokemon-editor-content">
            <div className="editor-header">
              <h3>⚙️ Editar {selectedPokemonForEdit.nombre_pok}</h3>
              <button
                onClick={closePokemonEditor}
                className="btn-close-modal"
              >
                ✕
              </button>
            </div>

            <div className="editor-form">
              {/* Información básica */}
              <div className="basic-info">
                <h4>📝 Información Básica</h4>
                <div className="basic-info-grid">
                  <div>
                    <label>Apodo:</label>
                    <input
                      type="text"
                      value={pokemonEditData.apodo_pok}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, apodo_pok: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Nivel:</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={pokemonEditData.nivel}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, nivel: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label>Experiencia:</label>
                    <input
                      type="number"
                      min="0"
                      value={pokemonEditData.experiencia}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, experiencia: parseInt(e.target.value)})}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Editor de estadísticas estilo Smogon */}
              <div className="stats-editor">
                <h4>📊 Editor de Estadísticas</h4>
                
                {/* Información del Pokémon */}
                {loadingBaseStats ? (
                  <div style={{ 
                    background: '#fff3cd', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #ffeaa7',
                    fontSize: '14px',
                    color: '#000'
                  }}>
                    ⏳ Cargando estadísticas base del Pokémon...
                  </div>
                ) : selectedPokemonBaseStats ? (
                  <div style={{ 
                    background: '#e8f5e8', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #d4edda',
                    fontSize: '14px',
                    color: '#000'
                  }}>
                    ✅ <strong>Estadísticas base de {selectedPokemonForEdit?.nombre_pok} cargadas</strong>
                  </div>
                ) : (
                  <div style={{ 
                    background: '#f8d7da', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #f5c6cb',
                    fontSize: '14px',
                    color: '#000'
                  }}>
                    ❌ Error al cargar las estadísticas base
                  </div>
                )}
                
                <div className="stat-form">
                  <div className="stat-grid">
                    {/* Headers */}
                    <div className="stat-header"></div>
                    <div className="stat-header">HP</div>
                    <div className="stat-header">Attack</div>
                    <div className="stat-header">Defense</div>
                    <div className="stat-header">Sp. Atk.</div>
                    <div className="stat-header">Sp. Def.</div>
                    <div className="stat-header">Speed</div>

                    {/* Base stats row */}
                    <div className="stat-label">Base</div>
                    <div className="base-stat">{selectedPokemonBaseStats?.HP || 50}</div>
                    <div className="base-stat">{selectedPokemonBaseStats?.ataque || 50}</div>
                    <div className="base-stat">{selectedPokemonBaseStats?.defensa || 50}</div>
                    <div className="base-stat">{selectedPokemonBaseStats?.sp_ataque || 50}</div>
                    <div className="base-stat">{selectedPokemonBaseStats?.sp_defensa || 50}</div>
                    <div className="base-stat">{selectedPokemonBaseStats?.velocidad || 50}</div>

                    {/* Visual bars */}
                    <div className="stat-label">Graph</div>
                    <div className="stat-bar">
                      <div className="bar-fill" style={{
                        width: `${Math.min((selectedPokemonBaseStats?.HP || 50) * 2, 255)}px`, 
                        background: 'hsl(84,85%,45%)'
                      }}></div>
                    </div>
                    <div className="stat-bar">
                      <div className="bar-fill" style={{
                        width: `${Math.min((selectedPokemonBaseStats?.ataque || 50) * 2, 255)}px`, 
                        background: 'hsl(45,85%,45%)'
                      }}></div>
                    </div>
                    <div className="stat-bar">
                      <div className="bar-fill" style={{
                        width: `${Math.min((selectedPokemonBaseStats?.defensa || 50) * 2, 255)}px`, 
                        background: 'hsl(62,85%,45%)'
                      }}></div>
                    </div>
                    <div className="stat-bar">
                      <div className="bar-fill" style={{
                        width: `${Math.min((selectedPokemonBaseStats?.sp_ataque || 50) * 2, 255)}px`, 
                        background: 'hsl(35,85%,45%)'
                      }}></div>
                    </div>
                    <div className="stat-bar">
                      <div className="bar-fill" style={{
                        width: `${Math.min((selectedPokemonBaseStats?.sp_defensa || 50) * 2, 255)}px`, 
                        background: 'hsl(51,85%,45%)'
                      }}></div>
                    </div>
                    <div className="stat-bar">
                      <div className="bar-fill" style={{
                        width: `${Math.min((selectedPokemonBaseStats?.velocidad || 50) * 2, 255)}px`, 
                        background: 'hsl(42,85%,45%)'
                      }}></div>
                    </div>

                    {/* EVs row */}
                    <div className="stat-label">EVs</div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_hp}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_hp: parseInt(e.target.value) || 0})}
                        className="ev-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_ataque}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_ataque: parseInt(e.target.value) || 0})}
                        className="ev-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_defensa}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_defensa: parseInt(e.target.value) || 0})}
                        className="ev-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_ataque_especial}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_ataque_especial: parseInt(e.target.value) || 0})}
                        className="ev-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_defensa_especial}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_defensa_especial: parseInt(e.target.value) || 0})}
                        className="ev-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_velocidad}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_velocidad: parseInt(e.target.value) || 0})}
                        className="ev-input"
                      />
                    </div>

                    {/* EV Sliders */}
                    <div className="stat-label">Sliders</div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_hp}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_hp: parseInt(e.target.value)})}
                        className="ev-slider"
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_ataque}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_ataque: parseInt(e.target.value)})}
                        className="ev-slider"
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_defensa}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_defensa: parseInt(e.target.value)})}
                        className="ev-slider"
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_ataque_especial}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_ataque_especial: parseInt(e.target.value)})}
                        className="ev-slider"
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_defensa_especial}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_defensa_especial: parseInt(e.target.value)})}
                        className="ev-slider"
                      />
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="252"
                        step="4"
                        value={pokemonEditData.ev_velocidad}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, ev_velocidad: parseInt(e.target.value)})}
                        className="ev-slider"
                      />
                    </div>

                    {/* IVs row */}
                    <div className="stat-label">IVs</div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={pokemonEditData.iv_hp}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, iv_hp: parseInt(e.target.value) || 0})}
                        className="iv-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={pokemonEditData.iv_ataque}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, iv_ataque: parseInt(e.target.value) || 0})}
                        className="iv-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={pokemonEditData.iv_defensa}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, iv_defensa: parseInt(e.target.value) || 0})}
                        className="iv-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={pokemonEditData.iv_ataque_especial}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, iv_ataque_especial: parseInt(e.target.value) || 0})}
                        className="iv-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={pokemonEditData.iv_defensa_especial}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, iv_defensa_especial: parseInt(e.target.value) || 0})}
                        className="iv-input"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={pokemonEditData.iv_velocidad}
                        onChange={(e) => setPokemonEditData({...pokemonEditData, iv_velocidad: parseInt(e.target.value) || 0})}
                        className="iv-input"
                      />
                    </div>
                  </div>

                  {/* Total EVs */}
                  <div className="ev-total">
                    <strong>Total EVs: {pokemonEditData.ev_hp + pokemonEditData.ev_ataque + pokemonEditData.ev_defensa + 
                      pokemonEditData.ev_ataque_especial + pokemonEditData.ev_defensa_especial + pokemonEditData.ev_velocidad} / 510</strong>
                  </div>
                  
                  {/* Info sobre naturalezas */}
                  <div className="nature-info" style={{ 
                    background: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ fontSize: '14px', color: '#000', fontWeight: '500', marginBottom: '8px' }}>
                      ℹ️ Información sobre Naturalezas
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Las naturalezas afectan las estadísticas del Pokémon. Algunas aumentan una estadística en un 10% y reducen otra en un 10%.
                      Las naturalezas neutrales no afectan ninguna estadística.
                    </div>
                  </div>

                  {/* Nature selector */}
                  <div className="nature-selector">
                    <label>Nature:</label>
                    <select
                      value={pokemonEditData.naturaleza}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, naturaleza: e.target.value})}
                      className="nature-select"
                      disabled={naturalezasDisponibles.length === 0}
                    >
                      {naturalezasDisponibles.length === 0 ? (
                        <option value="">Cargando naturalezas...</option>
                      ) : (
                        naturalezasDisponibles.map(nature => (
                          <option key={nature.id_naturaleza} value={nature.nombre}>
                            {nature.nombre} {nature.sube_stat !== 'none' && nature.baja_stat !== 'none' 
                              ? `(${nature.sube_stat}, ${nature.baja_stat})` 
                              : '(Neutral)'}
                          </option>
                        ))
                      )}
                    </select>
                    
                    {/* Mostrar efecto de la naturaleza actual */}
                    {naturalezasDisponibles.length > 0 && pokemonEditData.naturaleza && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                        {(() => {
                          const selectedNature = naturalezasDisponibles.find(n => n.nombre === pokemonEditData.naturaleza)
                          if (selectedNature) {
                            if (selectedNature.sube_stat === 'none' || selectedNature.baja_stat === 'none') {
                              return '✨ Naturaleza neutral - No afecta las estadísticas'
                            } else {
                              return `📈 ${selectedNature.sube_stat} | 📉 ${selectedNature.baja_stat}`
                            }
                          }
                          return ''
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sección de Movimientos */}
              <div className="moves-section">
                <h4>⚔️ Movimientos</h4>
                {loadingMovimientos ? (
                  <div style={{ 
                    background: '#fff3cd', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #ffeaa7',
                    fontSize: '14px',
                    color: '#000'
                  }}>
                    ⏳ Cargando movimientos disponibles...
                  </div>
                ) : (
                  <div className="moves-grid">
                    {pokemonEditData.movimientos.map((movimiento, index) => (
                      <div key={index} className="move-selector">
                        <label>Movimiento {index + 1}:</label>
                        <select
                          value={movimiento || ''}
                          onChange={(e) => {
                            const newMovimientos = [...pokemonEditData.movimientos]
                            newMovimientos[index] = e.target.value || null
                            setPokemonEditData({...pokemonEditData, movimientos: newMovimientos})
                          }}
                          className="move-select"
                          disabled={pokemonMovimientos.length === 0}
                        >
                          <option value="">Ninguno</option>
                          {pokemonMovimientos.map(move => (
                            <option key={move.id_movimiento} value={move.id_movimiento}>
                              {move.nombre_mov} {move.tipo && `(${move.tipo})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sección de Habilidad */}
              <div className="ability-section">
                <h4>🔮 Habilidad</h4>
                {loadingHabilidades ? (
                  <div style={{ 
                    background: '#fff3cd', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #ffeaa7',
                    fontSize: '14px',
                    color: '#000'
                  }}>
                    ⏳ Cargando habilidades disponibles...
                  </div>
                ) : (
                  <div className="ability-selector">
                    <label>Habilidad:</label>
                    <select
                      value={pokemonEditData.id_habilidad || ''}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, id_habilidad: e.target.value || null})}
                      className="ability-select"
                      disabled={pokemonHabilidades.length === 0}
                    >
                      <option value="">Ninguna</option>
                      {pokemonHabilidades.map(ability => (
                        <option key={ability.id_habilidad} value={ability.id_habilidad}>
                          {ability.nombre_hab}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Sección de Artículo */}
              <div className="item-section">
                <h4>🎒 Artículo</h4>
                {loadingArticulos ? (
                  <div style={{ 
                    background: '#fff3cd', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    marginBottom: '15px',
                    border: '1px solid #ffeaa7',
                    fontSize: '14px',
                    color: '#000'
                  }}>
                    ⏳ Cargando artículos disponibles...
                  </div>
                ) : (
                  <div className="item-selector">
                    <label>Artículo:</label>
                    <select
                      value={pokemonEditData.id_articulo || ''}
                      onChange={(e) => setPokemonEditData({...pokemonEditData, id_articulo: e.target.value || null})}
                      className="item-select"
                      disabled={pokemonArticulos.length === 0}
                    >
                      <option value="">Ninguno</option>
                      {pokemonArticulos.map(item => (
                        <option key={item.id_articulo} value={item.id_articulo}>
                          {item.nombre}
                        </option>
                      ))}
                    </select>
                    
                    {/* Mostrar descripción del artículo seleccionado */}
                    {pokemonEditData.id_articulo && pokemonArticulos.length > 0 && (
                      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                        {(() => {
                          const selectedItem = pokemonArticulos.find(item => item.id_articulo.toString() === pokemonEditData.id_articulo.toString())
                          if (selectedItem) {
                            return `💡 ${selectedItem.descripcion}`
                          }
                          return ''
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="editor-actions">
                <button
                  onClick={closePokemonEditor}
                  className="btn-cancel-edit"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePokemonEdit}
                  className="btn-save-edit"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamBuilder
