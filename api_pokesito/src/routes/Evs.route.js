const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosEvs,
    obtenerEvPorId,
    crearEv,
    actualizarEv,
    eliminarEv
} = require('../controllers/Evs.controllers');

// RUTAS BÁSICAS PARA EVS

// GET /api/evs - Obtener todos los EVs
router.get('/', obtenerTodosLosEvs);

// GET /api/evs/:id - Obtener un EV por ID
router.get('/:id', obtenerEvPorId);

// POST /api/evs - Crear un nuevo EV
router.post('/', crearEv);

// PUT /api/evs/:id - Actualizar un EV
router.put('/:id', actualizarEv);

// DELETE /api/evs/:id - Eliminar un EV
router.delete('/:id', eliminarEv);

module.exports = router;
