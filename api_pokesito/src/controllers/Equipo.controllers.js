const { Equipo, Equipo_Pokemon } = require('../models');

// Obtener todos los equipos
const obtenerTodosLosEquipos = async (req, res) => {
    try {
        const equipos = await Equipo.findAll({
            order: [['id_equipo', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Equipos obtenidos exitosamente',
            datos: equipos
        });
    } catch (error) {
        console.error('Error al obtener equipos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener equipo por ID
const obtenerEquipoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Equipo no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Equipo obtenido exitosamente',
            datos: equipo
        });
    } catch (error) {
        console.error('Error al obtener equipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo equipo
const crearEquipo = async (req, res) => {
    try {
        const { nombre, id_usuario } = req.body;

        // Validar campos requeridos
        if (!nombre || id_usuario === undefined) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nombre, id_usuario)'
            });
        }

        // Validar que el nombre no esté vacío
        if (nombre.trim().length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El nombre del equipo no puede estar vacío'
            });
        }

        // Validar que el nombre no sea demasiado largo
        if (nombre.length > 255) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El nombre del equipo no puede exceder 255 caracteres'
            });
        }

        // Validar que id_usuario sea un número positivo
        if (!Number.isInteger(Number(id_usuario)) || Number(id_usuario) < 1) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El ID del usuario debe ser un número entero positivo'
            });
        }

        const nuevoEquipo = await Equipo.create({
            nombre: nombre.trim(),
            id_usuario: Number(id_usuario)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Equipo creado exitosamente',
            datos: nuevoEquipo
        });
    } catch (error) {
        console.error('Error al crear equipo:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'El usuario especificado no existe'
            });
        }

        // Manejar errores de unicidad si los hay
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un equipo con esos datos'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar equipo
const actualizarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_usuario } = req.body;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Equipo no encontrado'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            nombre: equipo.nombre,
            id_usuario: equipo.id_usuario
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };
        if (nombre !== undefined) {
            // Validar nombre
            if (nombre.trim().length === 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre del equipo no puede estar vacío'
                });
            }
            if (nombre.length > 255) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre del equipo no puede exceder 255 caracteres'
                });
            }
            valoresNuevos.nombre = nombre.trim();
        }

        if (id_usuario !== undefined) {
            // Validar id_usuario
            if (!Number.isInteger(Number(id_usuario)) || Number(id_usuario) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID del usuario debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_usuario = Number(id_usuario);
        }

        await equipo.update(valoresNuevos);

        // Obtener el equipo actualizado
        const equipoActualizado = await Equipo.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Equipo actualizado exitosamente',
            datos: equipoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar equipo:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'El usuario especificado no existe'
            });
        }

        // Manejar errores de unicidad si los hay
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un equipo con esos datos'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar equipo
const eliminarEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.findByPk(id);

        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Equipo no encontrado'
            });
        }

        await equipo.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Equipo eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar equipo:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el equipo porque tiene Pokémon asociados'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener Pokémon de un equipo específico
const obtenerPokemonDeEquipo = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el equipo existe
        const equipo = await Equipo.findByPk(id);
        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Equipo no encontrado'
            });
        }

        // Obtener todos los Pokémon del equipo con información básica
        const pokemonEquipo = await Equipo_Pokemon.findAll({
            where: { id_equipo: id },
            order: [['id_equipo_pokemon', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon del equipo obtenidos exitosamente',
            datos: {
                equipo: {
                    id_equipo: equipo.id_equipo,
                    nombre: equipo.nombre,
                    id_usuario: equipo.id_usuario
                },
                pokemon: pokemonEquipo,
                total_pokemon: pokemonEquipo.length
            }
        });
    } catch (error) {
        console.error('Error al obtener Pokémon del equipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodosLosEquipos,
    obtenerEquipoPorId,
    crearEquipo,
    actualizarEquipo,
    eliminarEquipo,
    obtenerPokemonDeEquipo
};