const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosDetalles,
    obtenerDetallePorId,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle,
    upload
} = require('../controllers/Detalle.controllers');

// RUTAS BÁSICAS PARA DETALLES

// GET /api/detalles - Obtener todos los detalles
router.get('/', obtenerTodosLosDetalles);

// GET /api/detalles/:id - Obtener detalle por ID
router.get('/:id', obtenerDetallePorId);

// POST /api/detalles - Crear nuevo detalle (con imagen)
router.post('/', upload.single('imagen'), crearDetalle);

// PUT /api/detalles/:id - Actualizar detalle (con imagen opcional)
router.put('/:id', upload.single('imagen'), actualizarDetalle);

// DELETE /api/detalles/:id - Eliminar detalle
router.delete('/:id', eliminarDetalle);

module.exports = router;