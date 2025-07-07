const { Habilidad } = require('../models');

// Obtener todas las habilidades
const obtenerTodasLasHabilidades = async (req, res) => {
    try {
        const habilidades = await Habilidad.findAll({
            order: [['id_habilidad', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Habilidades obtenidas exitosamente',
            datos: habilidades
        });
    } catch (error) {
        console.error('Error al obtener habilidades:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener una habilidad por ID
const obtenerHabilidadPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const habilidad = await Habilidad.findByPk(id);

        if (!habilidad) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Habilidad no encontrada'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Habilidad obtenida exitosamente',
            datos: habilidad
        });
    } catch (error) {
        console.error('Error al obtener habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear una nueva habilidad
const crearHabilidad = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Validar campos requeridos
        if (!nombre || !descripcion) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nombre, descripcion)'
            });
        }

        // Verificar si ya existe una habilidad con el mismo nombre
        const habilidadExistente = await Habilidad.findOne({ where: { nombre } });
        if (habilidadExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe una habilidad con ese nombre'
            });
        }

        const nuevaHabilidad = await Habilidad.create({
            nombre,
            descripcion
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Habilidad creada exitosamente',
            datos: nuevaHabilidad
        });
    } catch (error) {
        console.error('Error al crear habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar una habilidad
const actualizarHabilidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const habilidad = await Habilidad.findByPk(id);

        if (!habilidad) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Habilidad no encontrada'
            });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo la habilidad actual)
        if (nombre && nombre !== habilidad.nombre) {
            const habilidadExistente = await Habilidad.findOne({ 
                where: { nombre },
                raw: true
            });
            if (habilidadExistente && habilidadExistente.id_habilidad !== parseInt(id)) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe una habilidad con ese nombre'
                });
            }
        }

        // Actualizar solo los campos proporcionados
        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;

        await habilidad.update(datosActualizados);

        // Obtener la habilidad actualizada
        const habilidadActualizada = await Habilidad.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Habilidad actualizada exitosamente',
            datos: habilidadActualizada
        });
    } catch (error) {
        console.error('Error al actualizar habilidad:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar una habilidad
const eliminarHabilidad = async (req, res) => {
    try {
        const { id } = req.params;

        const habilidad = await Habilidad.findByPk(id);

        if (!habilidad) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Habilidad no encontrada'
            });
        }

        await habilidad.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Habilidad eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar habilidad:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar la habilidad porque está siendo utilizada por otros registros'
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
    obtenerTodasLasHabilidades,
    obtenerHabilidadPorId,
    crearHabilidad,
    actualizarHabilidad,
    eliminarHabilidad
};
