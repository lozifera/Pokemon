const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasEstadisticas,
    obtenerEstadisticasPorId,
    crearEstadisticas,
    actualizarEstadisticas,
    eliminarEstadisticas
} = require('../controllers/Estadisticas.controllers');

// RUTAS BÁSICAS PARA ESTADÍSTICAS

// GET /api/estadisticas - Obtener todas las estadísticas
router.get('/', obtenerTodasLasEstadisticas);

// GET /api/estadisticas/:id - Obtener estadísticas por ID
router.get('/:id', obtenerEstadisticasPorId);

// POST /api/estadisticas - Crear nuevas estadísticas
router.post('/', crearEstadisticas);

// PUT /api/estadisticas/:id - Actualizar estadísticas
router.put('/:id', actualizarEstadisticas);

// DELETE /api/estadisticas/:id - Eliminar estadísticas
router.delete('/:id', eliminarEstadisticas);

module.exports = router;