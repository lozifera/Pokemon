const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosEquipos,
    obtenerEquipoPorId,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo
} = require('../controllers/Equipo.controllers');

// RUTAS BÁSICAS PARA EQUIPOS

// GET /api/equipos - Obtener todos los equipos
router.get('/', obtenerTodosLosEquipos);

// GET /api/equipos/:id - Obtener equipo por ID
router.get('/:id', obtenerEquipoPorId);

// POST /api/equipos - Crear nuevo equipo
router.post('/', crearEquipo);

// PUT /api/equipos/:id - Actualizar equipo
router.put('/:id', actualizarEquipo);

// DELETE /api/equipos/:id - Eliminar equipo
router.delete('/:id', eliminarEquipo);

module.exports = router;