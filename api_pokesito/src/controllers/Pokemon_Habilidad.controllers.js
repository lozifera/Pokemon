const { Pokemon_Habilidad } = require('../models');

// Obtener todas las relaciones pokémon-habilidad
const obtenerTodasLasRelaciones = async (req, res) => {
    try {
        const relaciones = await Pokemon_Habilidad.findAll({
            order: [['id_pokemon', 'ASC'], ['id_habilidad', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Relaciones pokémon-habilidad obtenidas exitosamente',
            datos: relaciones
        });
    } catch (error) {
        console.error('Error al obtener relaciones pokémon-habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener habilidades de un pokémon específico
const obtenerHabilidadesPorPokemon = async (req, res) => {
    try {
        const { id_pokemon } = req.params;

        const habilidadesPokemon = await Pokemon_Habilidad.findAll({
            where: { id_pokemon }
        });

        if (habilidadesPokemon.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron habilidades para este pokémon'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Habilidades del pokémon obtenidas exitosamente',
            datos: habilidadesPokemon
        });
    } catch (error) {
        console.error('Error al obtener habilidades del pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener pokémon que tienen una habilidad específica
const obtenerPokemonPorHabilidad = async (req, res) => {
    try {
        const { id_habilidad } = req.params;

        const pokemonHabilidad = await Pokemon_Habilidad.findAll({
            where: { id_habilidad }
        });

        if (pokemonHabilidad.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron pokémon para esta habilidad'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon de la habilidad obtenidos exitosamente',
            datos: pokemonHabilidad
        });
    } catch (error) {
        console.error('Error al obtener pokémon de la habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener habilidades por tipo (normal u oculta)
const obtenerHabilidadesPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params;

        if (!['normal', 'oculta'].includes(tipo)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El tipo debe ser "normal" u "oculta"'
            });
        }

        const habilidades = await Pokemon_Habilidad.findAll({
            where: { tipo }
        });

        res.status(200).json({
            exito: true,
            mensaje: `Habilidades ${tipo}s obtenidas exitosamente`,
            datos: habilidades
        });
    } catch (error) {
        console.error('Error al obtener habilidades por tipo:', error);
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
        const { id_pokemon, id_habilidad } = req.params;

        const relacion = await Pokemon_Habilidad.findOne({
            where: { 
                id_pokemon, 
                id_habilidad 
            }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-habilidad no encontrada'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-habilidad obtenida exitosamente',
            datos: relacion
        });
    } catch (error) {
        console.error('Error al obtener relación pokémon-habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva relación pokémon-habilidad
const crearRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_habilidad, tipo } = req.body;

        // Validar campos requeridos
        if (!id_pokemon || !id_habilidad || !tipo) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos id_pokemon, id_habilidad y tipo son requeridos'
            });
        }

        // Validar tipo
        if (!['normal', 'oculta'].includes(tipo)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El tipo debe ser "normal" u "oculta"'
            });
        }

        // Verificar si la relación ya existe
        const relacionExistente = await Pokemon_Habilidad.findOne({
            where: { id_pokemon, id_habilidad }
        });

        if (relacionExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'La relación entre este pokémon y habilidad ya existe'
            });
        }

        // Verificar que un pokémon no tenga más de una habilidad oculta
        if (tipo === 'oculta') {
            const habilidadOcultaExistente = await Pokemon_Habilidad.findOne({
                where: { 
                    id_pokemon,
                    tipo: 'oculta'
                }
            });

            if (habilidadOcultaExistente) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Un pokémon solo puede tener una habilidad oculta'
                });
            }
        }

        // Verificar que un pokémon no tenga más de 2 habilidades normales
        if (tipo === 'normal') {
            const habilidadesNormales = await Pokemon_Habilidad.count({
                where: { 
                    id_pokemon,
                    tipo: 'normal'
                }
            });

            if (habilidadesNormales >= 2) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Un pokémon no puede tener más de 2 habilidades normales'
                });
            }
        }

        const nuevaRelacion = await Pokemon_Habilidad.create({
            id_pokemon: Number(id_pokemon),
            id_habilidad: Number(id_habilidad),
            tipo
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Relación pokémon-habilidad creada exitosamente',
            datos: nuevaRelacion
        });
    } catch (error) {
        console.error('Error al crear relación pokémon-habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar una relación pokémon-habilidad
const actualizarRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_habilidad } = req.params;
        const { tipo } = req.body;

        const relacion = await Pokemon_Habilidad.findOne({
            where: { id_pokemon, id_habilidad }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-habilidad no encontrada'
            });
        }

        // Validar tipo si se proporciona
        if (tipo && !['normal', 'oculta'].includes(tipo)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El tipo debe ser "normal" u "oculta"'
            });
        }

        // Si se quiere cambiar a habilidad oculta, verificar que no haya otra
        if (tipo === 'oculta' && relacion.tipo !== 'oculta') {
            const habilidadOcultaExistente = await Pokemon_Habilidad.findOne({
                where: { 
                    id_pokemon,
                    tipo: 'oculta',
                    id_habilidad: { [require('sequelize').Op.ne]: id_habilidad }
                }
            });

            if (habilidadOcultaExistente) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Un pokémon solo puede tener una habilidad oculta'
                });
            }
        }

        // Actualizar solo el campo tipo si se proporciona
        if (tipo !== undefined) {
            await relacion.update({ tipo });
        }

        // Obtener la relación actualizada
        const relacionActualizada = await Pokemon_Habilidad.findOne({
            where: { id_pokemon, id_habilidad }
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-habilidad actualizada exitosamente',
            datos: relacionActualizada
        });
    } catch (error) {
        console.error('Error al actualizar relación pokémon-habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una relación pokémon-habilidad
const eliminarRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_habilidad } = req.params;

        const relacion = await Pokemon_Habilidad.findOne({
            where: { id_pokemon, id_habilidad }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-habilidad no encontrada'
            });
        }

        await relacion.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-habilidad eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar relación pokémon-habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar habilidades de un pokémon (reemplazar todas las habilidades)
const actualizarHabilidadesPokemon = async (req, res) => {
    try {
        const { id_pokemon } = req.params;
        const { habilidades } = req.body; // Array de objetos { id_habilidad, tipo }

        if (!habilidades || !Array.isArray(habilidades)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere un array de habilidades con formato: [{ id_habilidad, tipo }]'
            });
        }

        // Validar límites y tipos
        const habilidadesNormales = habilidades.filter(h => h.tipo === 'normal');
        const habilidadesOcultas = habilidades.filter(h => h.tipo === 'oculta');

        if (habilidadesNormales.length > 2) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon no puede tener más de 2 habilidades normales'
            });
        }

        if (habilidadesOcultas.length > 1) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon solo puede tener una habilidad oculta'
            });
        }

        // Validar tipos
        for (const habilidad of habilidades) {
            if (!['normal', 'oculta'].includes(habilidad.tipo)) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Cada habilidad debe tener tipo "normal" u "oculta"'
                });
            }
        }

        // Eliminar todas las relaciones actuales del pokémon
        await Pokemon_Habilidad.destroy({
            where: { id_pokemon }
        });

        // Crear las nuevas relaciones (solo si hay habilidades)
        if (habilidades.length > 0) {
            await Promise.all(
                habilidades.map(habilidad => 
                    Pokemon_Habilidad.create({
                        id_pokemon: Number(id_pokemon),
                        id_habilidad: Number(habilidad.id_habilidad),
                        tipo: habilidad.tipo
                    })
                )
            );
        }

        // Obtener las relaciones creadas
        const relacionesCompletas = await Pokemon_Habilidad.findAll({
            where: { id_pokemon }
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Habilidades del pokémon actualizadas exitosamente',
            datos: relacionesCompletas
        });
    } catch (error) {
        console.error('Error al actualizar habilidades del pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodasLasRelaciones,
    obtenerHabilidadesPorPokemon,
    obtenerPokemonPorHabilidad,
    obtenerHabilidadesPorTipo,
    obtenerRelacionEspecifica,
    crearRelacion,
    actualizarRelacion,
    eliminarRelacion,
    actualizarHabilidadesPokemon
};
