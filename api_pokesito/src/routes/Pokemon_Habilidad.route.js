const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasRelaciones,
    obtenerHabilidadesPorPokemon,
    obtenerPokemonPorHabilidad,
    obtenerHabilidadesPorTipo,
    obtenerRelacionEspecifica,
    crearRelacion,
    actualizarRelacion,
    eliminarRelacion,
    actualizarHabilidadesPokemon
} = require('../controllers/Pokemon_Habilidad.controllers');

// RUTAS PARA RELACIONES POKÉMON-HABILIDAD

// GET /api/pokemon-habilidad - Obtener todas las relaciones pokémon-habilidad
router.get('/', obtenerTodasLasRelaciones);

// GET /api/pokemon-habilidad/pokemon/:id_pokemon - Obtener habilidades de un pokémon específico
router.get('/pokemon/:id_pokemon', obtenerHabilidadesPorPokemon);

// GET /api/pokemon-habilidad/habilidad/:id_habilidad - Obtener pokémon que tienen una habilidad
router.get('/habilidad/:id_habilidad', obtenerPokemonPorHabilidad);

// GET /api/pokemon-habilidad/tipo/:tipo - Obtener habilidades por tipo (normal/oculta)
router.get('/tipo/:tipo', obtenerHabilidadesPorTipo);

// GET /api/pokemon-habilidad/:id_pokemon/:id_habilidad - Obtener una relación específica
router.get('/:id_pokemon/:id_habilidad', obtenerRelacionEspecifica);

// POST /api/pokemon-habilidad - Crear una nueva relación pokémon-habilidad
router.post('/', crearRelacion);

// PUT /api/pokemon-habilidad/:id_pokemon/:id_habilidad - Actualizar una relación específica
router.put('/:id_pokemon/:id_habilidad', actualizarRelacion);

// PUT /api/pokemon-habilidad/pokemon/:id_pokemon - Actualizar todas las habilidades de un pokémon
router.put('/pokemon/:id_pokemon', actualizarHabilidadesPokemon);

// DELETE /api/pokemon-habilidad/:id_pokemon/:id_habilidad - Eliminar una relación pokémon-habilidad
router.delete('/:id_pokemon/:id_habilidad', eliminarRelacion);

module.exports = router;
