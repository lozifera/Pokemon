const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasHabilidades,
    obtenerHabilidadPorId,
    crearHabilidad,
    actualizarHabilidad,
    eliminarHabilidad
} = require('../controllers/Habilidad.controllers');

// RUTAS BÁSICAS PARA HABILIDADES

// GET /api/habilidades - Obtener todas las habilidades
router.get('/', obtenerTodasLasHabilidades);

// GET /api/habilidades/:id - Obtener una habilidad por ID
router.get('/:id', obtenerHabilidadPorId);

// POST /api/habilidades - Crear una nueva habilidad
router.post('/', crearHabilidad);

// PUT /api/habilidades/:id - Actualizar una habilidad
router.put('/:id', actualizarHabilidad);

// DELETE /api/habilidades/:id - Eliminar una habilidad
router.delete('/:id', eliminarHabilidad);

module.exports = router;
