const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosIvs,
    obtenerIvPorId,
    crearIv,
    actualizarIv,
    eliminarIv
} = require('../controllers/Ivs.controllers');

// RUTAS BÁSICAS PARA IVS

// GET /api/ivs - Obtener todos los IVs
router.get('/', obtenerTodosLosIvs);

// GET /api/ivs/:id - Obtener un IV por ID
router.get('/:id', obtenerIvPorId);

// POST /api/ivs - Crear un nuevo IV
router.post('/', crearIv);

// PUT /api/ivs/:id - Actualizar un IV
router.put('/:id', actualizarIv);

// DELETE /api/ivs/:id - Eliminar un IV
router.delete('/:id', eliminarIv);

module.exports = router;
