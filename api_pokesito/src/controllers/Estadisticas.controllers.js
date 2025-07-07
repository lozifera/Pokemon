const { Estadisticas } = require('../models');

// Obtener todas las estadísticas
const obtenerTodasLasEstadisticas = async (req, res) => {
    try {
        const estadisticas = await Estadisticas.findAll({
            order: [['id_estadisticas', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Estadísticas obtenidas exitosamente',
            datos: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener estadísticas por ID
const obtenerEstadisticasPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const estadisticas = await Estadisticas.findByPk(id);

        if (!estadisticas) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Estadísticas no encontradas'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Estadísticas obtenidas exitosamente',
            datos: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevas estadísticas
const crearEstadisticas = async (req, res) => {
    try {
        const { HP, ataque, defensa, sp_ataque, sp_defensa, velocidad, id_evs, id_ivs, id_naturaleza } = req.body;

        // Validar campos requeridos
        if (HP === undefined || ataque === undefined || defensa === undefined || 
            sp_ataque === undefined || sp_defensa === undefined || velocidad === undefined ||
            id_evs === undefined || id_ivs === undefined || id_naturaleza === undefined) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (HP, ataque, defensa, sp_ataque, sp_defensa, velocidad, id_evs, id_ivs, id_naturaleza)'
            });
        }

        // Validar que las estadísticas base sean positivas
        const stats = [HP, ataque, defensa, sp_ataque, sp_defensa, velocidad];
        if (stats.some(stat => stat < 1 || stat > 255 || !Number.isInteger(Number(stat)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Las estadísticas deben ser números enteros entre 1 y 255'
            });
        }

        // Validar que los IDs sean números positivos
        const ids = [id_evs, id_ivs, id_naturaleza];
        if (ids.some(id => id < 1 || !Number.isInteger(Number(id)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los IDs deben ser números enteros positivos'
            });
        }

        const nuevasEstadisticas = await Estadisticas.create({
            HP: Number(HP),
            ataque: Number(ataque),
            defensa: Number(defensa),
            sp_ataque: Number(sp_ataque),
            sp_defensa: Number(sp_defensa),
            velocidad: Number(velocidad),
            id_evs: Number(id_evs),
            id_ivs: Number(id_ivs),
            id_naturaleza: Number(id_naturaleza)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Estadísticas creadas exitosamente',
            datos: nuevasEstadisticas
        });
    } catch (error) {
        console.error('Error al crear estadísticas:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'Uno o más IDs referenciados no existen'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar estadísticas
const actualizarEstadisticas = async (req, res) => {
    try {
        const { id } = req.params;
        const { HP, ataque, defensa, sp_ataque, sp_defensa, velocidad, id_evs, id_ivs, id_naturaleza } = req.body;

        const estadisticas = await Estadisticas.findByPk(id);

        if (!estadisticas) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Estadísticas no encontradas'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            HP: estadisticas.HP,
            ataque: estadisticas.ataque,
            defensa: estadisticas.defensa,
            sp_ataque: estadisticas.sp_ataque,
            sp_defensa: estadisticas.sp_defensa,
            velocidad: estadisticas.velocidad,
            id_evs: estadisticas.id_evs,
            id_ivs: estadisticas.id_ivs,
            id_naturaleza: estadisticas.id_naturaleza
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };
        if (HP !== undefined) valoresNuevos.HP = Number(HP);
        if (ataque !== undefined) valoresNuevos.ataque = Number(ataque);
        if (defensa !== undefined) valoresNuevos.defensa = Number(defensa);
        if (sp_ataque !== undefined) valoresNuevos.sp_ataque = Number(sp_ataque);
        if (sp_defensa !== undefined) valoresNuevos.sp_defensa = Number(sp_defensa);
        if (velocidad !== undefined) valoresNuevos.velocidad = Number(velocidad);
        if (id_evs !== undefined) valoresNuevos.id_evs = Number(id_evs);
        if (id_ivs !== undefined) valoresNuevos.id_ivs = Number(id_ivs);
        if (id_naturaleza !== undefined) valoresNuevos.id_naturaleza = Number(id_naturaleza);

        // Validar estadísticas si se proporcionan
        const statsParaValidar = [valoresNuevos.HP, valoresNuevos.ataque, valoresNuevos.defensa, 
                                 valoresNuevos.sp_ataque, valoresNuevos.sp_defensa, valoresNuevos.velocidad];
        if (statsParaValidar.some(stat => stat < 1 || stat > 255 || !Number.isInteger(Number(stat)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Las estadísticas deben ser números enteros entre 1 y 255'
            });
        }

        // Validar IDs si se proporcionan
        const idsParaValidar = [valoresNuevos.id_evs, valoresNuevos.id_ivs, valoresNuevos.id_naturaleza];
        if (idsParaValidar.some(id => id < 1 || !Number.isInteger(Number(id)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los IDs deben ser números enteros positivos'
            });
        }

        await estadisticas.update(valoresNuevos);

        // Obtener las estadísticas actualizadas
        const estadisticasActualizadas = await Estadisticas.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Estadísticas actualizadas exitosamente',
            datos: estadisticasActualizadas
        });
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'Uno o más IDs referenciados no existen'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar estadísticas
const eliminarEstadisticas = async (req, res) => {
    try {
        const { id } = req.params;

        const estadisticas = await Estadisticas.findByPk(id);

        if (!estadisticas) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Estadísticas no encontradas'
            });
        }

        await estadisticas.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Estadísticas eliminadas exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar estadísticas:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se pueden eliminar las estadísticas porque están siendo utilizadas por otros registros'
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
    obtenerTodasLasEstadisticas,
    obtenerEstadisticasPorId,
    crearEstadisticas,
    actualizarEstadisticas,
    eliminarEstadisticas
};