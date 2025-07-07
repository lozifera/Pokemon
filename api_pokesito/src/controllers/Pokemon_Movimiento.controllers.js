const { Pokemon_Movimiento } = require('../models');

// Obtener todas las relaciones pokémon-movimiento
const obtenerTodasLasRelaciones = async (req, res) => {
    try {
        const relaciones = await Pokemon_Movimiento.findAll({
            order: [['id_pokemon', 'ASC'], ['id_movimiento', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Relaciones pokémon-movimiento obtenidas exitosamente',
            datos: relaciones
        });
    } catch (error) {
        console.error('Error al obtener relaciones pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener movimientos de un pokémon específico
const obtenerMovimientosPorPokemon = async (req, res) => {
    try {
        const { id_pokemon } = req.params;

        const movimientosPokemon = await Pokemon_Movimiento.findAll({
            where: { id_pokemon }
        });

        if (movimientosPokemon.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron movimientos para este pokémon'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Movimientos del pokémon obtenidos exitosamente',
            datos: movimientosPokemon
        });
    } catch (error) {
        console.error('Error al obtener movimientos del pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener pokémon que pueden aprender un movimiento específico
const obtenerPokemonPorMovimiento = async (req, res) => {
    try {
        const { id_movimiento } = req.params;

        const pokemonMovimiento = await Pokemon_Movimiento.findAll({
            where: { id_movimiento }
        });

        if (pokemonMovimiento.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron pokémon para este movimiento'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon del movimiento obtenidos exitosamente',
            datos: pokemonMovimiento
        });
    } catch (error) {
        console.error('Error al obtener pokémon del movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una relación específica
const obtenerRelacionEspecifica = async (req, res) => {
    try {
        const { id_pokemon, id_movimiento } = req.params;

        const relacion = await Pokemon_Movimiento.findOne({
            where: { 
                id_pokemon, 
                id_movimiento 
            }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-movimiento no encontrada'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-movimiento obtenida exitosamente',
            datos: relacion
        });
    } catch (error) {
        console.error('Error al obtener relación pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva relación pokémon-movimiento
const crearRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_movimiento } = req.body;

        // Validar campos requeridos
        if (!id_pokemon || !id_movimiento) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos id_pokemon e id_movimiento son requeridos'
            });
        }

        // Verificar si la relación ya existe
        const relacionExistente = await Pokemon_Movimiento.findOne({
            where: { id_pokemon, id_movimiento }
        });

        if (relacionExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'La relación entre este pokémon y movimiento ya existe'
            });
        }

        // Verificar que un pokémon no tenga más de 4 movimientos
        const movimientosActuales = await Pokemon_Movimiento.count({
            where: { id_pokemon }
        });

        if (movimientosActuales >= 4) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon no puede tener más de 4 movimientos'
            });
        }

        const nuevaRelacion = await Pokemon_Movimiento.create({
            id_pokemon: Number(id_pokemon),
            id_movimiento: Number(id_movimiento)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Relación pokémon-movimiento creada exitosamente',
            datos: nuevaRelacion
        });
    } catch (error) {
        console.error('Error al crear relación pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una relación pokémon-movimiento
const eliminarRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_movimiento } = req.params;

        const relacion = await Pokemon_Movimiento.findOne({
            where: { id_pokemon, id_movimiento }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-movimiento no encontrada'
            });
        }

        await relacion.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-movimiento eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar relación pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar movimientos de un pokémon (reemplazar todos los movimientos)
const actualizarMovimientosPokemon = async (req, res) => {
    try {
        const { id_pokemon } = req.params;
        const { movimientos } = req.body; // Array de id_movimiento

        if (!movimientos || !Array.isArray(movimientos)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere un array de movimientos (máximo 4)'
            });
        }

        if (movimientos.length > 4) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon no puede tener más de 4 movimientos'
            });
        }

        // Eliminar todas las relaciones actuales del pokémon
        await Pokemon_Movimiento.destroy({
            where: { id_pokemon }
        });

        // Crear las nuevas relaciones (solo si hay movimientos)
        if (movimientos.length > 0) {
            await Promise.all(
                movimientos.map(id_movimiento => 
                    Pokemon_Movimiento.create({
                        id_pokemon: Number(id_pokemon),
                        id_movimiento: Number(id_movimiento)
                    })
                )
            );
        }

        // Obtener las relaciones creadas
        const relacionesCompletas = await Pokemon_Movimiento.findAll({
            where: { id_pokemon }
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Movimientos del pokémon actualizados exitosamente',
            datos: relacionesCompletas
        });
    } catch (error) {
        console.error('Error al actualizar movimientos del pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodasLasRelaciones,
    obtenerMovimientosPorPokemon,
    obtenerPokemonPorMovimiento,
    obtenerRelacionEspecifica,
    crearRelacion,
    eliminarRelacion,
    actualizarMovimientosPokemon
};
