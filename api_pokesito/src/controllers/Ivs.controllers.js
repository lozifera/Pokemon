const { Ivs } = require('../models');

// Obtener todos los IVs
const obtenerTodosLosIvs = async (req, res) => {
    try {
        const ivs = await Ivs.findAll({
            order: [['id_ivs', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'IVs obtenidos exitosamente',
            datos: ivs
        });
    } catch (error) {
        console.error('Error al obtener IVs:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un IV por ID
const obtenerIvPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const iv = await Ivs.findByPk(id);

        if (!iv) {
            return res.status(404).json({
                exito: false,
                mensaje: 'IV no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'IV obtenido exitosamente',
            datos: iv
        });
    } catch (error) {
        console.error('Error al obtener IV:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo IV
const crearIv = async (req, res) => {
    try {
        const { HP, ataque, defensa, sp_ataque, sp_defensa, velocidad } = req.body;

        // Validar campos requeridos
        if (HP === undefined || ataque === undefined || defensa === undefined || 
            sp_ataque === undefined || sp_defensa === undefined || velocidad === undefined) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (HP, ataque, defensa, sp_ataque, sp_defensa, velocidad)'
            });
        }

        // Validar que los IVs estén entre 0 y 31
        const stats = [HP, ataque, defensa, sp_ataque, sp_defensa, velocidad];
        if (stats.some(stat => stat < 0 || stat > 31 || !Number.isInteger(Number(stat)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los IVs deben ser números enteros entre 0 y 31'
            });
        }

        const nuevoIv = await Ivs.create({
            HP: Number(HP),
            ataque: Number(ataque),
            defensa: Number(defensa),
            sp_ataque: Number(sp_ataque),
            sp_defensa: Number(sp_defensa),
            velocidad: Number(velocidad)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'IV creado exitosamente',
            datos: nuevoIv
        });
    } catch (error) {
        console.error('Error al crear IV:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un IV
const actualizarIv = async (req, res) => {
    try {
        const { id } = req.params;
        const { HP, ataque, defensa, sp_ataque, sp_defensa, velocidad } = req.body;

        const iv = await Ivs.findByPk(id);

        if (!iv) {
            return res.status(404).json({
                exito: false,
                mensaje: 'IV no encontrado'
            });
        }

        // Validar IVs si se proporcionan
        const statsParaValidar = [HP, ataque, defensa, sp_ataque, sp_defensa, velocidad]
            .filter(stat => stat !== undefined);
        
        if (statsParaValidar.length > 0) {
            if (statsParaValidar.some(stat => stat < 0 || stat > 31 || !Number.isInteger(Number(stat)))) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Los IVs deben ser números enteros entre 0 y 31'
                });
            }
        }

        // Actualizar solo los campos proporcionados
        const datosActualizados = {};
        if (HP !== undefined) datosActualizados.HP = Number(HP);
        if (ataque !== undefined) datosActualizados.ataque = Number(ataque);
        if (defensa !== undefined) datosActualizados.defensa = Number(defensa);
        if (sp_ataque !== undefined) datosActualizados.sp_ataque = Number(sp_ataque);
        if (sp_defensa !== undefined) datosActualizados.sp_defensa = Number(sp_defensa);
        if (velocidad !== undefined) datosActualizados.velocidad = Number(velocidad);

        await iv.update(datosActualizados);

        // Obtener el IV actualizado
        const ivActualizado = await Ivs.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'IV actualizado exitosamente',
            datos: ivActualizado
        });
    } catch (error) {
        console.error('Error al actualizar IV:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un IV
const eliminarIv = async (req, res) => {
    try {
        const { id } = req.params;

        const iv = await Ivs.findByPk(id);

        if (!iv) {
            return res.status(404).json({
                exito: false,
                mensaje: 'IV no encontrado'
            });
        }

        await iv.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'IV eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar IV:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el IV porque está siendo utilizado por otros registros'
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
    obtenerTodosLosIvs,
    obtenerIvPorId,
    crearIv,
    actualizarIv,
    eliminarIv
};
