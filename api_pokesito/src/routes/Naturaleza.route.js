const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasNaturalezas,
    obtenerNaturalezaPorId,
    buscarNaturalezasPorNombre,
    obtenerNaturalezasPorStatSube,
    obtenerNaturalezasPorStatBaja,
    crearNaturaleza,
    actualizarNaturaleza,
    eliminarNaturaleza
} = require('../controllers/Naturaleza.controllers');

// RUTAS PARA NATURALEZAS

// GET /api/naturalezas - Obtener todas las naturalezas
router.get('/', obtenerTodasLasNaturalezas);

// GET /api/naturalezas/buscar?nombre=adamant - Buscar naturalezas por nombre
router.get('/buscar', buscarNaturalezasPorNombre);

// GET /api/naturalezas/sube/:stat - Obtener naturalezas que suben una estadística
router.get('/sube/:stat', obtenerNaturalezasPorStatSube);

// GET /api/naturalezas/baja/:stat - Obtener naturalezas que bajan una estadística
router.get('/baja/:stat', obtenerNaturalezasPorStatBaja);

// GET /api/naturalezas/:id - Obtener una naturaleza por ID
router.get('/:id', obtenerNaturalezaPorId);

// POST /api/naturalezas - Crear una nueva naturaleza
router.post('/', crearNaturaleza);

// PUT /api/naturalezas/:id - Actualizar una naturaleza
router.put('/:id', actualizarNaturaleza);

// DELETE /api/naturalezas/:id - Eliminar una naturaleza
router.delete('/:id', eliminarNaturaleza);

module.exports = router;
