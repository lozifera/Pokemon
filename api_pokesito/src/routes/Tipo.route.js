const express = require('express');
const router = express.Router();
const {
    obtenerTipos,
    obtenerTipoPorId,
    crearTipo,
    actualizarTipo,
    eliminarTipo,
    upload
} = require('../controllers/Tipo.controllers');

// RUTAS PARA TIPOS
// GET /api/tipos - Obtener todos los tipos
router.get('/', obtenerTipos);

// GET /api/tipos/:id - Obtener un tipo por ID
router.get('/:id', obtenerTipoPorId);

// POST /api/tipos - Crear un nuevo tipo (con imagen)
router.post('/', upload.single('imagen'), crearTipo);

// PUT /api/tipos/:id - Actualizar un tipo (con imagen opcional)
router.put('/:id', upload.single('imagen'), actualizarTipo);

// DELETE /api/tipos/:id - Eliminar un tipo
router.delete('/:id', eliminarTipo);

module.exports = router;
