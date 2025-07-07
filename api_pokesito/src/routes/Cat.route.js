const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    upload
} = require('../controllers/Cat.controllers');

// RUTAS BÁSICAS PARA CATEGORÍAS

// GET /api/categorias - Obtener todas las categorías
router.get('/', obtenerTodasLasCategorias);

// GET /api/categorias/:id - Obtener categoría por ID
router.get('/:id', obtenerCategoriaPorId);

// POST /api/categorias - Crear nueva categoría (con imagen)
router.post('/', upload.single('imagen'), crearCategoria);

// PUT /api/categorias/:id - Actualizar categoría (con imagen opcional)
router.put('/:id', upload.single('imagen'), actualizarCategoria);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', eliminarCategoria);

module.exports = router;