const express = require('express');
const router = express.Router();
const {
    obtenerTodasLasRelaciones,
    obtenerMovimientosPorEquipoPokemon,
    obtenerEquiposPorMovimiento,
    obtenerMovimientoPorSlot,
    obtenerRelacionEspecifica,
    crearRelacion,
    actualizarSlotMovimiento,
    eliminarRelacion,
    actualizarMovimientosEquipoPokemon
} = require('../controllers/Pok_Mov.controllers');

// RUTAS PARA RELACIONES EQUIPO-POKÉMON-MOVIMIENTO

// GET /api/pok-mov - Obtener todas las relaciones equipo-pokémon-movimiento
router.get('/', obtenerTodasLasRelaciones);

// GET /api/pok-mov/equipo-pokemon/:id_equipo_pokemon - Obtener movimientos de un pokémon del equipo
router.get('/equipo-pokemon/:id_equipo_pokemon', obtenerMovimientosPorEquipoPokemon);

// GET /api/pok-mov/movimiento/:id_movimiento - Obtener pokémon de equipos que usan un movimiento
router.get('/movimiento/:id_movimiento', obtenerEquiposPorMovimiento);

// GET /api/pok-mov/equipo-pokemon/:id_equipo_pokemon/slot/:slot - Obtener movimiento en un slot específico
router.get('/equipo-pokemon/:id_equipo_pokemon/slot/:slot', obtenerMovimientoPorSlot);

// GET /api/pok-mov/:id_equipo_pokemon/:id_movimiento - Obtener una relación específica
router.get('/:id_equipo_pokemon/:id_movimiento', obtenerRelacionEspecifica);

// POST /api/pok-mov - Crear una nueva relación equipo-pokémon-movimiento
router.post('/', crearRelacion);

// PUT /api/pok-mov/:id_equipo_pokemon/:id_movimiento - Actualizar slot de un movimiento específico
router.put('/:id_equipo_pokemon/:id_movimiento', actualizarSlotMovimiento);

// PUT /api/pok-mov/equipo-pokemon/:id_equipo_pokemon - Actualizar todos los movimientos de un pokémon del equipo
router.put('/equipo-pokemon/:id_equipo_pokemon', actualizarMovimientosEquipoPokemon);

// DELETE /api/pok-mov/:id_equipo_pokemon/:id_movimiento - Eliminar una relación equipo-pokémon-movimiento
router.delete('/:id_equipo_pokemon/:id_movimiento', eliminarRelacion);

module.exports = router;
