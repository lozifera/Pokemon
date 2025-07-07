const { Evs } = require('../models');

// Obtener todos los EVs
const obtenerTodosLosEvs = async (req, res) => {
    try {
        const evs = await Evs.findAll({
            order: [['id_evs', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'EVs obtenidos exitosamente',
            datos: evs
        });
    } catch (error) {
        console.error('Error al obtener EVs:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un EV por ID
const obtenerEvPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const ev = await Evs.findByPk(id);

        if (!ev) {
            return res.status(404).json({
                exito: false,
                mensaje: 'EV no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'EV obtenido exitosamente',
            datos: ev
        });
    } catch (error) {
        console.error('Error al obtener EV:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo EV
const crearEv = async (req, res) => {
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

        // Validar que los EVs estén entre 0 y 252
        const stats = [HP, ataque, defensa, sp_ataque, sp_defensa, velocidad];
        if (stats.some(stat => stat < 0 || stat > 252 || !Number.isInteger(Number(stat)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los EVs deben ser números enteros entre 0 y 252'
            });
        }

        // Validar que la suma total no exceda 510
        const totalEvs = stats.reduce((sum, stat) => sum + Number(stat), 0);
        if (totalEvs > 510) {
            return res.status(400).json({
                exito: false,
                mensaje: 'La suma total de EVs no puede exceder 510'
            });
        }

        const nuevoEv = await Evs.create({
            HP: Number(HP),
            ataque: Number(ataque),
            defensa: Number(defensa),
            sp_ataque: Number(sp_ataque),
            sp_defensa: Number(sp_defensa),
            velocidad: Number(velocidad)
        });

        res.status(201).json({
            exito: true,
            mensaje: 'EV creado exitosamente',
            datos: nuevoEv
        });
    } catch (error) {
        console.error('Error al crear EV:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un EV
const actualizarEv = async (req, res) => {
    try {
        const { id } = req.params;
        const { HP, ataque, defensa, sp_ataque, sp_defensa, velocidad } = req.body;

        const ev = await Evs.findByPk(id);

        if (!ev) {
            return res.status(404).json({
                exito: false,
                mensaje: 'EV no encontrado'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            HP: ev.HP,
            ataque: ev.ataque,
            defensa: ev.defensa,
            sp_ataque: ev.sp_ataque,
            sp_defensa: ev.sp_defensa,
            velocidad: ev.velocidad
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };
        if (HP !== undefined) valoresNuevos.HP = Number(HP);
        if (ataque !== undefined) valoresNuevos.ataque = Number(ataque);
        if (defensa !== undefined) valoresNuevos.defensa = Number(defensa);
        if (sp_ataque !== undefined) valoresNuevos.sp_ataque = Number(sp_ataque);
        if (sp_defensa !== undefined) valoresNuevos.sp_defensa = Number(sp_defensa);
        if (velocidad !== undefined) valoresNuevos.velocidad = Number(velocidad);

        // Validar EVs si se proporcionan
        const statsParaValidar = Object.values(valoresNuevos);
        if (statsParaValidar.some(stat => stat < 0 || stat > 252 || !Number.isInteger(Number(stat)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los EVs deben ser números enteros entre 0 y 252'
            });
        }

        // Validar que la suma total no exceda 510
        const totalEvs = statsParaValidar.reduce((sum, stat) => sum + Number(stat), 0);
        if (totalEvs > 510) {
            return res.status(400).json({
                exito: false,
                mensaje: 'La suma total de EVs no puede exceder 510'
            });
        }

        await ev.update(valoresNuevos);

        // Obtener el EV actualizado
        const evActualizado = await Evs.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'EV actualizado exitosamente',
            datos: evActualizado
        });
    } catch (error) {
        console.error('Error al actualizar EV:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un EV
const eliminarEv = async (req, res) => {
    try {
        const { id } = req.params;

        const ev = await Evs.findByPk(id);

        if (!ev) {
            return res.status(404).json({
                exito: false,
                mensaje: 'EV no encontrado'
            });
        }

        await ev.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'EV eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar EV:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el EV porque está siendo utilizado por otros registros'
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
    obtenerTodosLosEvs,
    obtenerEvPorId,
    crearEv,
    actualizarEv,
    eliminarEv
};
