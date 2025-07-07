const { Naturaleza } = require('../models');

// Obtener todas las naturalezas
const obtenerTodasLasNaturalezas = async (req, res) => {
    try {
        const naturalezas = await Naturaleza.findAll({
            order: [['id_naturaleza', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Naturalezas obtenidas exitosamente',
            datos: naturalezas
        });
    } catch (error) {
        console.error('Error al obtener naturalezas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una naturaleza por ID
const obtenerNaturalezaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const naturaleza = await Naturaleza.findByPk(id);

        if (!naturaleza) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Naturaleza no encontrada'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Naturaleza obtenida exitosamente',
            datos: naturaleza
        });
    } catch (error) {
        console.error('Error al obtener naturaleza:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Buscar naturalezas por nombre
const buscarNaturalezasPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El parámetro nombre es requerido'
            });
        }

        const naturalezas = await Naturaleza.findAll({
            where: {
                nombre: {
                    [require('sequelize').Op.iLike]: `%${nombre}%`
                }
            },
            order: [['nombre', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: `Se encontraron ${naturalezas.length} naturalezas que coinciden con la búsqueda`,
            datos: naturalezas
        });
    } catch (error) {
        console.error('Error al buscar naturalezas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener naturalezas por estadística que sube
const obtenerNaturalezasPorStatSube = async (req, res) => {
    try {
        const { stat } = req.params;

        const naturalezas = await Naturaleza.findAll({
            where: { sube_stat: stat },
            order: [['nombre', 'ASC']]
        });

        if (naturalezas.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron naturalezas que suban esa estadística'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Naturalezas que suben la estadística obtenidas exitosamente',
            datos: naturalezas
        });
    } catch (error) {
        console.error('Error al obtener naturalezas por estadística que sube:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener naturalezas por estadística que baja
const obtenerNaturalezasPorStatBaja = async (req, res) => {
    try {
        const { stat } = req.params;

        const naturalezas = await Naturaleza.findAll({
            where: { baja_stat: stat },
            order: [['nombre', 'ASC']]
        });

        if (naturalezas.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se encontraron naturalezas que bajen esa estadística'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Naturalezas que bajan la estadística obtenidas exitosamente',
            datos: naturalezas
        });
    } catch (error) {
        console.error('Error al obtener naturalezas por estadística que baja:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva naturaleza
const crearNaturaleza = async (req, res) => {
    try {
        const { nombre, sube_stat, baja_stat } = req.body;

        // Validar campos requeridos
        if (!nombre || !sube_stat || !baja_stat) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nombre, sube_stat, baja_stat)'
            });
        }

        // Verificar si ya existe una naturaleza con el mismo nombre
        const naturalezaExistente = await Naturaleza.findOne({ where: { nombre } });
        if (naturalezaExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe una naturaleza con ese nombre'
            });
        }

        const nuevaNaturaleza = await Naturaleza.create({
            nombre,
            sube_stat,
            baja_stat
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Naturaleza creada exitosamente',
            datos: nuevaNaturaleza
        });
    } catch (error) {
        console.error('Error al crear naturaleza:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar una naturaleza
const actualizarNaturaleza = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, sube_stat, baja_stat } = req.body;

        const naturaleza = await Naturaleza.findByPk(id);

        if (!naturaleza) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Naturaleza no encontrada'
            });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo la naturaleza actual)
        if (nombre && nombre !== naturaleza.nombre) {
            const naturalezaExistente = await Naturaleza.findOne({ 
                where: { nombre },
                raw: true
            });
            if (naturalezaExistente && naturalezaExistente.id_naturaleza !== parseInt(id)) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe una naturaleza con ese nombre'
                });
            }
        }

        // Actualizar solo los campos proporcionados
        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (sube_stat !== undefined) datosActualizados.sube_stat = sube_stat;
        if (baja_stat !== undefined) datosActualizados.baja_stat = baja_stat;

        await naturaleza.update(datosActualizados);

        // Obtener la naturaleza actualizada
        const naturalezaActualizada = await Naturaleza.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Naturaleza actualizada exitosamente',
            datos: naturalezaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar naturaleza:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una naturaleza
const eliminarNaturaleza = async (req, res) => {
    try {
        const { id } = req.params;

        const naturaleza = await Naturaleza.findByPk(id);

        if (!naturaleza) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Naturaleza no encontrada'
            });
        }

        await naturaleza.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Naturaleza eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar naturaleza:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar la naturaleza porque está siendo utilizada por otros registros'
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
    obtenerTodasLasNaturalezas,
    obtenerNaturalezaPorId,
    buscarNaturalezasPorNombre,
    obtenerNaturalezasPorStatSube,
    obtenerNaturalezasPorStatBaja,
    crearNaturaleza,
    actualizarNaturaleza,
    eliminarNaturaleza
};
