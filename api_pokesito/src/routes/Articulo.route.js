const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosArticulos,
    obtenerArticuloPorId,
    crearArticulo,
    actualizarArticulo,
    eliminarArticulo,
    upload
} = require('../controllers/Articulo.controllers');

// RUTAS BÁSICAS PARA ARTÍCULOS

// GET /api/articulos - Obtener todos los artículos
router.get('/', obtenerTodosLosArticulos);

// GET /api/articulos/:id - Obtener artículo por ID
router.get('/:id', obtenerArticuloPorId);

// POST /api/articulos - Crear nuevo artículo (con imagen)
router.post('/', upload.single('imagen'), crearArticulo);

// PUT /api/articulos/:id - Actualizar artículo (con imagen opcional)
router.put('/:id', upload.single('imagen'), actualizarArticulo);

// DELETE /api/articulos/:id - Eliminar artículo
router.delete('/:id', eliminarArticulo);

module.exports = router;