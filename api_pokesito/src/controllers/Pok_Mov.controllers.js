const { Pok_Mov } = require('../models');

// Obtener todas las relaciones equipo-pokémon-movimiento
const obtenerTodasLasRelaciones = async (req, res) => {
    try {
        const relaciones = await Pok_Mov.findAll({
            order: [['id_equipo_pokemon', 'ASC'], ['slot', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Relaciones equipo-pokémon-movimiento obtenidas exitosamente',
            datos: relaciones
        });
    } catch (error) {
        console.error('Error al obtener relaciones equipo-pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener movimientos de un equipo-pokémon específico
const obtenerMovimientosPorEquipoPokemon = async (req, res) => {
    try {
        const { id_equipo_pokemon } = req.params;

        const movimientos = await Pok_Mov.findAll({
            where: { id_equipo_pokemon },
            order: [['slot', 'ASC']]
        });

        if (movimientos.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron movimientos para este pokémon del equipo'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Movimientos del pokémon del equipo obtenidos exitosamente',
            datos: movimientos
        });
    } catch (error) {
        console.error('Error al obtener movimientos del pokémon del equipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener pokémon de equipos que usan un movimiento específico
const obtenerEquiposPorMovimiento = async (req, res) => {
    try {
        const { id_movimiento } = req.params;

        const equipos = await Pok_Mov.findAll({
            where: { id_movimiento },
            order: [['id_equipo_pokemon', 'ASC']]
        });

        if (equipos.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron pokémon de equipos que usen este movimiento'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon de equipos que usan el movimiento obtenidos exitosamente',
            datos: equipos
        });
    } catch (error) {
        console.error('Error al obtener equipos por movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener movimiento en un slot específico de un pokémon del equipo
const obtenerMovimientoPorSlot = async (req, res) => {
    try {
        const { id_equipo_pokemon, slot } = req.params;

        const movimiento = await Pok_Mov.findOne({
            where: { 
                id_equipo_pokemon,
                slot: Number(slot)
            }
        });

        if (!movimiento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontró movimiento en ese slot para este pokémon del equipo'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Movimiento del slot obtenido exitosamente',
            datos: movimiento
        });
    } catch (error) {
        console.error('Error al obtener movimiento por slot:', error);
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
        const { id_equipo_pokemon, id_movimiento } = req.params;

        const relacion = await Pok_Mov.findOne({
            where: { 
                id_equipo_pokemon, 
                id_movimiento 
            }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación equipo-pokémon-movimiento no encontrada'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Relación equipo-pokémon-movimiento obtenida exitosamente',
            datos: relacion
        });
    } catch (error) {
        console.error('Error al obtener relación equipo-pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva relación equipo-pokémon-movimiento
const crearRelacion = async (req, res) => {
    try {
        const { id_equipo_pokemon, id_movimiento, slot } = req.body;

        // Validar campos requeridos
        if (!id_equipo_pokemon || !id_movimiento || !slot) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos id_equipo_pokemon, id_movimiento y slot son requeridos'
            });
        }

        // Validar slot
        if (![1, 2, 3, 4].includes(Number(slot))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El slot debe ser un número entre 1 y 4'
            });
        }

        // Verificar si ya existe un movimiento en ese slot
        const slotOcupado = await Pok_Mov.findOne({
            where: { 
                id_equipo_pokemon,
                slot: Number(slot)
            }
        });

        if (slotOcupado) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un movimiento en ese slot para este pokémon del equipo'
            });
        }

        // Verificar si la relación ya existe (mismo pokémon y movimiento)
        const relacionExistente = await Pok_Mov.findOne({
            where: { id_equipo_pokemon, id_movimiento }
        });

        if (relacionExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Este pokémon del equipo ya tiene este movimiento asignado'
            });
        }

        const nuevaRelacion = await Pok_Mov.create({
            id_equipo_pokemon: Number(id_equipo_pokemon),
            id_movimiento: Number(id_movimiento),
            slot: Number(slot)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Relación equipo-pokémon-movimiento creada exitosamente',
            datos: nuevaRelacion
        });
    } catch (error) {
        console.error('Error al crear relación equipo-pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar el slot de un movimiento
const actualizarSlotMovimiento = async (req, res) => {
    try {
        const { id_equipo_pokemon, id_movimiento } = req.params;
        const { slot } = req.body;

        const relacion = await Pok_Mov.findOne({
            where: { id_equipo_pokemon, id_movimiento }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación equipo-pokémon-movimiento no encontrada'
            });
        }

        // Validar slot si se proporciona
        if (slot && ![1, 2, 3, 4].includes(Number(slot))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El slot debe ser un número entre 1 y 4'
            });
        }

        // Verificar si el nuevo slot ya está ocupado
        if (slot && Number(slot) !== relacion.slot) {
            const slotOcupado = await Pok_Mov.findOne({
                where: { 
                    id_equipo_pokemon,
                    slot: Number(slot)
                }
            });

            if (slotOcupado) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe un movimiento en ese slot para este pokémon del equipo'
                });
            }
        }

        // Actualizar solo el slot si se proporciona
        if (slot !== undefined) {
            await relacion.update({ slot: Number(slot) });
        }

        // Obtener la relación actualizada
        const relacionActualizada = await Pok_Mov.findOne({
            where: { id_equipo_pokemon, id_movimiento }
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Slot del movimiento actualizado exitosamente',
            datos: relacionActualizada
        });
    } catch (error) {
        console.error('Error al actualizar slot del movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una relación equipo-pokémon-movimiento
const eliminarRelacion = async (req, res) => {
    try {
        const { id_equipo_pokemon, id_movimiento } = req.params;

        const relacion = await Pok_Mov.findOne({
            where: { id_equipo_pokemon, id_movimiento }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación equipo-pokémon-movimiento no encontrada'
            });
        }

        await relacion.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Relación equipo-pokémon-movimiento eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar relación equipo-pokémon-movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar todos los movimientos de un pokémon del equipo
const actualizarMovimientosEquipoPokemon = async (req, res) => {
    try {
        const { id_equipo_pokemon } = req.params;
        const { movimientos } = req.body; // Array de objetos { id_movimiento, slot }

        if (!movimientos || !Array.isArray(movimientos)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere un array de movimientos con formato: [{ id_movimiento, slot }]'
            });
        }

        if (movimientos.length > 4) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon del equipo no puede tener más de 4 movimientos'
            });
        }

        // Validar slots únicos
        const slots = movimientos.map(m => m.slot);
        const slotsUnicos = [...new Set(slots)];
        if (slots.length !== slotsUnicos.length) {
            return res.status(400).json({
                exito: false,
                mensaje: 'No puede haber movimientos duplicados en el mismo slot'
            });
        }

        // Validar que todos los slots sean válidos
        for (const movimiento of movimientos) {
            if (![1, 2, 3, 4].includes(Number(movimiento.slot))) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Todos los slots deben ser números entre 1 y 4'
                });
            }
        }

        // Eliminar todas las relaciones actuales del pokémon del equipo
        await Pok_Mov.destroy({
            where: { id_equipo_pokemon }
        });

        // Crear las nuevas relaciones (solo si hay movimientos)
        if (movimientos.length > 0) {
            await Promise.all(
                movimientos.map(movimiento => 
                    Pok_Mov.create({
                        id_equipo_pokemon: Number(id_equipo_pokemon),
                        id_movimiento: Number(movimiento.id_movimiento),
                        slot: Number(movimiento.slot)
                    })
                )
            );
        }

        // Obtener las relaciones creadas
        const relacionesCompletas = await Pok_Mov.findAll({
            where: { id_equipo_pokemon },
            order: [['slot', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Movimientos del pokémon del equipo actualizados exitosamente',
            datos: relacionesCompletas
        });
    } catch (error) {
        console.error('Error al actualizar movimientos del pokémon del equipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodasLasRelaciones,
    obtenerMovimientosPorEquipoPokemon,
    obtenerEquiposPorMovimiento,
    obtenerMovimientoPorSlot,
    obtenerRelacionEspecifica,
    crearRelacion,
    actualizarSlotMovimiento,
    eliminarRelacion,
    actualizarMovimientosEquipoPokemon
};
