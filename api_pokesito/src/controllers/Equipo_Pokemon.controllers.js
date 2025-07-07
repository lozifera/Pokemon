const { Equipo_Pokemon } = require('../models');

// Obtener todos los Pokémon de equipos
const obtenerTodosLosEquipoPokemon = async (req, res) => {
    try {
        const equipoPokemon = await Equipo_Pokemon.findAll({
            order: [['id_equipo_pokemon', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon de equipos obtenidos exitosamente',
            datos: equipoPokemon
        });
    } catch (error) {
        console.error('Error al obtener Pokémon de equipos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener Pokémon de equipo por ID
const obtenerEquipoPokemonPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const equipoPokemon = await Equipo_Pokemon.findByPk(id);

        if (!equipoPokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon de equipo no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon de equipo obtenido exitosamente',
            datos: equipoPokemon
        });
    } catch (error) {
        console.error('Error al obtener Pokémon de equipo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo Pokémon de equipo
const crearEquipoPokemon = async (req, res) => {
    try {
        const { 
            id_equipo, 
            nombre_pok, 
            apodo_pok, 
            img_pok, 
            id_pokemon, 
            id_detalle, 
            id_articulo, 
            id_estadisticas, 
            id_habilidad 
        } = req.body;

        // Validar campos requeridos básicos
        if (id_equipo === undefined || !nombre_pok || !apodo_pok || id_pokemon === undefined) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos básicos son requeridos (id_equipo, nombre_pok, apodo_pok, id_pokemon)'
            });
        }

        // Validar que los campos de texto no estén vacíos
        if (nombre_pok.trim().length === 0 || apodo_pok.trim().length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos de texto no pueden estar vacíos'
            });
        }

        // Validar longitud de campos de texto
        if (nombre_pok.length > 255 || apodo_pok.length > 255) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos de texto no pueden exceder 255 caracteres'
            });
        }

        // Validar img_pok si se proporciona
        if (img_pok && img_pok.length > 255) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El campo img_pok no puede exceder 255 caracteres'
            });
        }

        // Validar que los IDs obligatorios sean números enteros positivos
        const idsObligatorios = [id_equipo, id_pokemon];
        if (idsObligatorios.some(id => !Number.isInteger(Number(id)) || Number(id) < 1)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los IDs de equipo y pokémon deben ser números enteros positivos'
            });
        }

        // Validar IDs opcionales si se proporcionan
        const idsOpcionales = [id_detalle, id_articulo, id_estadisticas, id_habilidad];
        const idsOpcionalesValidos = idsOpcionales.filter(id => id !== undefined && id !== null);
        if (idsOpcionalesValidos.some(id => !Number.isInteger(Number(id)) || Number(id) < 1)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los IDs deben ser números enteros positivos'
            });
        }

        const nuevoEquipoPokemon = await Equipo_Pokemon.create({
            id_equipo: Number(id_equipo),
            nombre_pok: nombre_pok.trim(),
            apodo_pok: apodo_pok.trim(),
            img_pok: img_pok ? img_pok.trim() : null,
            id_pokemon: Number(id_pokemon),
            id_detalle: id_detalle ? Number(id_detalle) : null,
            id_articulo: id_articulo ? Number(id_articulo) : null,
            id_estadisticas: id_estadisticas ? Number(id_estadisticas) : null,
            id_habilidad: id_habilidad ? Number(id_habilidad) : null
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Pokémon de equipo creado exitosamente',
            datos: nuevoEquipoPokemon
        });
    } catch (error) {
        console.error('Error al crear Pokémon de equipo:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'Uno o más IDs referenciados no existen'
            });
        }

        // Manejar errores de unicidad si los hay
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un Pokémon de equipo con esos datos'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar Pokémon de equipo
const actualizarEquipoPokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            id_equipo, 
            nombre_pok, 
            apodo_pok, 
            img_pok, 
            id_pokemon, 
            id_detalle, 
            id_articulo, 
            id_estadisticas, 
            id_habilidad 
        } = req.body;

        const equipoPokemon = await Equipo_Pokemon.findByPk(id);

        if (!equipoPokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon de equipo no encontrado'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            id_equipo: equipoPokemon.id_equipo,
            nombre_pok: equipoPokemon.nombre_pok,
            apodo_pok: equipoPokemon.apodo_pok,
            img_pok: equipoPokemon.img_pok,
            id_pokemon: equipoPokemon.id_pokemon,
            id_detalle: equipoPokemon.id_detalle,
            id_articulo: equipoPokemon.id_articulo,
            id_estadisticas: equipoPokemon.id_estadisticas,
            id_habilidad: equipoPokemon.id_habilidad
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };

        // Validar y actualizar campos de texto
        if (nombre_pok !== undefined) {
            if (nombre_pok.trim().length === 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre del Pokémon no puede estar vacío'
                });
            }
            if (nombre_pok.length > 255) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre del Pokémon no puede exceder 255 caracteres'
                });
            }
            valoresNuevos.nombre_pok = nombre_pok.trim();
        }

        if (apodo_pok !== undefined) {
            if (apodo_pok.trim().length === 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El apodo del Pokémon no puede estar vacío'
                });
            }
            if (apodo_pok.length > 255) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El apodo del Pokémon no puede exceder 255 caracteres'
                });
            }
            valoresNuevos.apodo_pok = apodo_pok.trim();
        }

        if (img_pok !== undefined) {
            if (img_pok.trim().length === 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La imagen del Pokémon no puede estar vacía'
                });
            }
            if (img_pok.length > 255) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La URL de la imagen no puede exceder 255 caracteres'
                });
            }
            valoresNuevos.img_pok = img_pok.trim();
        }

        // Validar y actualizar IDs
        if (id_equipo !== undefined) {
            if (!Number.isInteger(Number(id_equipo)) || Number(id_equipo) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID del equipo debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_equipo = Number(id_equipo);
        }

        if (id_pokemon !== undefined) {
            if (!Number.isInteger(Number(id_pokemon)) || Number(id_pokemon) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID del Pokémon debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_pokemon = Number(id_pokemon);
        }

        if (id_detalle !== undefined) {
            if (!Number.isInteger(Number(id_detalle)) || Number(id_detalle) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID del detalle debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_detalle = Number(id_detalle);
        }

        if (id_articulo !== undefined) {
            if (!Number.isInteger(Number(id_articulo)) || Number(id_articulo) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID del artículo debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_articulo = Number(id_articulo);
        }

        if (id_estadisticas !== undefined) {
            if (!Number.isInteger(Number(id_estadisticas)) || Number(id_estadisticas) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID de las estadísticas debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_estadisticas = Number(id_estadisticas);
        }

        if (id_habilidad !== undefined) {
            if (!Number.isInteger(Number(id_habilidad)) || Number(id_habilidad) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El ID de la habilidad debe ser un número entero positivo'
                });
            }
            valoresNuevos.id_habilidad = Number(id_habilidad);
        }

        await equipoPokemon.update(valoresNuevos);

        // Obtener el Pokémon de equipo actualizado
        const equipoPokemonActualizado = await Equipo_Pokemon.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon de equipo actualizado exitosamente',
            datos: equipoPokemonActualizado
        });
    } catch (error) {
        console.error('Error al actualizar Pokémon de equipo:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'Uno o más IDs referenciados no existen'
            });
        }

        // Manejar errores de unicidad si los hay
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un Pokémon de equipo con esos datos'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar Pokémon de equipo
const eliminarEquipoPokemon = async (req, res) => {
    try {
        const { id } = req.params;

        const equipoPokemon = await Equipo_Pokemon.findByPk(id);

        if (!equipoPokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon de equipo no encontrado'
            });
        }

        await equipoPokemon.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon de equipo eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar Pokémon de equipo:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el Pokémon de equipo porque está siendo utilizado por otros registros'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodosLosEquipoPokemon,
    obtenerEquipoPokemonPorId,
    crearEquipoPokemon,
    actualizarEquipoPokemon,
    eliminarEquipoPokemon
};