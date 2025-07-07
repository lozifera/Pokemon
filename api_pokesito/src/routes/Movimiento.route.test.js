const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosMovimientos,
    obtenerMovimientoPorId,
    crearMovimiento,
    actualizarMovimiento,
    eliminarMovimiento
} = require('../controllers/Movimiento.controllers');

// RUTAS BÁSICAS PARA MOVIMIENTOS

// GET /api/movimientos - Obtener todos los movimientos
router.get('/', obtenerTodosLosMovimientos);

// GET /api/movimientos/:id - Obtener un movimiento por ID
router.get('/:id', obtenerMovimientoPorId);

// POST /api/movimientos - Crear un nuevo movimiento
router.post('/', crearMovimiento);

// PUT /api/movimientos/:id - Actualizar un movimiento
router.put('/:id', actualizarMovimiento);

// DELETE /api/movimientos/:id - Eliminar un movimiento
router.delete('/:id', eliminarMovimiento);

module.exports = router;
