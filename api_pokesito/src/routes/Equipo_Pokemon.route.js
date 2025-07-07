const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosEquipoPokemon,
    obtenerEquipoPokemonPorId,
    crearEquipoPokemon,
    actualizarEquipoPokemon,
    eliminarEquipoPokemon
} = require('../controllers/Equipo_Pokemon.controllers');

// RUTAS BÁSICAS PARA EQUIPOS POKÉMON

// GET /api/equipo-pokemon - Obtener todos los Pokémon de equipos
router.get('/', obtenerTodosLosEquipoPokemon);

// GET /api/equipo-pokemon/:id - Obtener Pokémon de equipo por ID
router.get('/:id', obtenerEquipoPokemonPorId);

// POST /api/equipo-pokemon - Crear nuevo Pokémon de equipo
router.post('/', crearEquipoPokemon);

// PUT /api/equipo-pokemon/:id - Actualizar Pokémon de equipo
router.put('/:id', actualizarEquipoPokemon);

// DELETE /api/equipo-pokemon/:id - Eliminar Pokémon de equipo
router.delete('/:id', eliminarEquipoPokemon);

module.exports = router;