const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasRelaciones,
    obtenerMovimientosPorPokemon,
    obtenerPokemonPorMovimiento,
    obtenerRelacionEspecifica,
    crearRelacion,
    eliminarRelacion,
    actualizarMovimientosPokemon
} = require('../controllers/Pokemon_Movimiento.controllers');

// RUTAS PARA RELACIONES POKÉMON-MOVIMIENTO

// GET /api/pokemon-movimiento - Obtener todas las relaciones pokémon-movimiento
router.get('/', obtenerTodasLasRelaciones);

// GET /api/pokemon-movimiento/pokemon/:id_pokemon - Obtener movimientos de un pokémon específico
router.get('/pokemon/:id_pokemon', obtenerMovimientosPorPokemon);

// GET /api/pokemon-movimiento/movimiento/:id_movimiento - Obtener pokémon que pueden aprender un movimiento
router.get('/movimiento/:id_movimiento', obtenerPokemonPorMovimiento);

// GET /api/pokemon-movimiento/:id_pokemon/:id_movimiento - Obtener una relación específica
router.get('/:id_pokemon/:id_movimiento', obtenerRelacionEspecifica);

// POST /api/pokemon-movimiento - Crear una nueva relación pokémon-movimiento
router.post('/', crearRelacion);

// PUT /api/pokemon-movimiento/pokemon/:id_pokemon - Actualizar todos los movimientos de un pokémon
router.put('/pokemon/:id_pokemon', actualizarMovimientosPokemon);

// DELETE /api/pokemon-movimiento/:id_pokemon/:id_movimiento - Eliminar una relación pokémon-movimiento
router.delete('/:id_pokemon/:id_movimiento', eliminarRelacion);

module.exports = router;
