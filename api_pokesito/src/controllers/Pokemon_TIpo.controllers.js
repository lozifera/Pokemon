const { Pokemon_Tipo } = require('../models');

// Obtener todas las relaciones pokémon-tipo
const obtenerTodasLasRelaciones = async (req, res) => {
    try {
        const relaciones = await Pokemon_Tipo.findAll({
            order: [['id_pokemon', 'ASC'], ['id_tipo', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Relaciones pokémon-tipo obtenidas exitosamente',
            datos: relaciones
        });
    } catch (error) {
        console.error('Error al obtener relaciones pokémon-tipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener tipos de un pokémon específico
const obtenerTiposPorPokemon = async (req, res) => {
    try {
        const { id_pokemon } = req.params;

        const tiposPokemon = await Pokemon_Tipo.findAll({
            where: { id_pokemon }
        });

        if (tiposPokemon.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron tipos para este pokémon'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Tipos del pokémon obtenidos exitosamente',
            datos: tiposPokemon
        });
    } catch (error) {
        console.error('Error al obtener tipos del pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener pokémon de un tipo específico
const obtenerPokemonPorTipo = async (req, res) => {
    try {
        const { id_tipo } = req.params;

        const pokemonTipo = await Pokemon_Tipo.findAll({
            where: { id_tipo }
        });

        if (pokemonTipo.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron pokémon para este tipo'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon del tipo obtenidos exitosamente',
            datos: pokemonTipo
        });
    } catch (error) {
        console.error('Error al obtener pokémon del tipo:', error);
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
        const { id_pokemon, id_tipo } = req.params;

        const relacion = await Pokemon_Tipo.findOne({
            where: { 
                id_pokemon, 
                id_tipo 
            }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-tipo no encontrada'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-tipo obtenida exitosamente',
            datos: relacion
        });
    } catch (error) {
        console.error('Error al obtener relación pokémon-tipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva relación pokémon-tipo
const crearRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_tipo } = req.body;

        // Validar campos requeridos
        if (!id_pokemon || !id_tipo) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos id_pokemon e id_tipo son requeridos'
            });
        }

        // Verificar si la relación ya existe
        const relacionExistente = await Pokemon_Tipo.findOne({
            where: { id_pokemon, id_tipo }
        });

        if (relacionExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'La relación entre este pokémon y tipo ya existe'
            });
        }

        // Verificar que un pokémon no tenga más de 2 tipos
        const tiposActuales = await Pokemon_Tipo.count({
            where: { id_pokemon }
        });

        if (tiposActuales >= 2) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon no puede tener más de 2 tipos'
            });
        }

        const nuevaRelacion = await Pokemon_Tipo.create({
            id_pokemon: Number(id_pokemon),
            id_tipo: Number(id_tipo)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Relación pokémon-tipo creada exitosamente',
            datos: nuevaRelacion
        });
    } catch (error) {
        console.error('Error al crear relación pokémon-tipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una relación pokémon-tipo
const eliminarRelacion = async (req, res) => {
    try {
        const { id_pokemon, id_tipo } = req.params;

        const relacion = await Pokemon_Tipo.findOne({
            where: { id_pokemon, id_tipo }
        });

        if (!relacion) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Relación pokémon-tipo no encontrada'
            });
        }

        // Verificar que el pokémon tenga al menos un tipo (no se puede eliminar si es el único)
        const tiposActuales = await Pokemon_Tipo.count({
            where: { id_pokemon }
        });

        if (tiposActuales <= 1) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon debe tener al menos un tipo. No se puede eliminar el único tipo.'
            });
        }

        await relacion.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Relación pokémon-tipo eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar relación pokémon-tipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar tipos de un pokémon (reemplazar todos los tipos)
const actualizarTiposPokemon = async (req, res) => {
    try {
        const { id_pokemon } = req.params;
        const { tipos } = req.body; // Array de id_tipo

        if (!tipos || !Array.isArray(tipos) || tipos.length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere un array de tipos (mínimo 1, máximo 2)'
            });
        }

        if (tipos.length > 2) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Un pokémon no puede tener más de 2 tipos'
            });
        }

        // Eliminar todas las relaciones actuales del pokémon
        await Pokemon_Tipo.destroy({
            where: { id_pokemon }
        });

        // Crear las nuevas relaciones
        await Promise.all(
            tipos.map(id_tipo => 
                Pokemon_Tipo.create({
                    id_pokemon: Number(id_pokemon),
                    id_tipo: Number(id_tipo)
                })
            )
        );

        // Obtener las relaciones creadas
        const relacionesCompletas = await Pokemon_Tipo.findAll({
            where: { id_pokemon }
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Tipos del pokémon actualizados exitosamente',
            datos: relacionesCompletas
        });
    } catch (error) {
        console.error('Error al actualizar tipos del pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodasLasRelaciones,
    obtenerTiposPorPokemon,
    obtenerPokemonPorTipo,
    obtenerRelacionEspecifica,
    crearRelacion,
    eliminarRelacion,
    actualizarTiposPokemon
};
