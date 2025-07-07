const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasRelaciones,
    obtenerTiposPorPokemon,
    obtenerPokemonPorTipo,
    obtenerRelacionEspecifica,
    crearRelacion,
    eliminarRelacion,
    actualizarTiposPokemon
} = require('../controllers/Pokemon_TIpo.controllers');

// RUTAS PARA RELACIONES POKÉMON-TIPO

// GET /api/pokemon-tipo - Obtener todas las relaciones pokémon-tipo
router.get('/', obtenerTodasLasRelaciones);

// GET /api/pokemon-tipo/pokemon/:id_pokemon - Obtener tipos de un pokémon específico
router.get('/pokemon/:id_pokemon', obtenerTiposPorPokemon);

// GET /api/pokemon-tipo/tipo/:id_tipo - Obtener pokémon de un tipo específico
router.get('/tipo/:id_tipo', obtenerPokemonPorTipo);

// GET /api/pokemon-tipo/:id_pokemon/:id_tipo - Obtener una relación específica
router.get('/:id_pokemon/:id_tipo', obtenerRelacionEspecifica);

// POST /api/pokemon-tipo - Crear una nueva relación pokémon-tipo
router.post('/', crearRelacion);

// PUT /api/pokemon-tipo/pokemon/:id_pokemon - Actualizar todos los tipos de un pokémon
router.put('/pokemon/:id_pokemon', actualizarTiposPokemon);

// DELETE /api/pokemon-tipo/:id_pokemon/:id_tipo - Eliminar una relación pokémon-tipo
router.delete('/:id_pokemon/:id_tipo', eliminarRelacion);

module.exports = router;
