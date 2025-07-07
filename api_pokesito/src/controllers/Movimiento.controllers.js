const { Movimiento } = require('../models');

// Obtener todos los movimientos
const obtenerTodosLosMovimientos = async (req, res) => {
    try {
        const movimientos = await Movimiento.findAll({
            order: [['id_movimiento', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Movimientos obtenidos exitosamente',
            datos: movimientos
        });
    } catch (error) {
        console.error('Error al obtener movimientos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un movimiento por ID
const obtenerMovimientoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const movimiento = await Movimiento.findByPk(id);

        if (!movimiento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Movimiento no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Movimiento obtenido exitosamente',
            datos: movimiento
        });
    } catch (error) {
        console.error('Error al obtener movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo movimiento
const crearMovimiento = async (req, res) => {
    try {
        const { nombre, id_tipo, id_cat, poder, ACC, PP, descripcion } = req.body;

        // Validar campos requeridos
        if (!nombre || !id_tipo || !id_cat || poder === undefined || ACC === undefined || PP === undefined || !descripcion) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nombre, id_tipo, id_cat, poder, ACC, PP, descripcion)'
            });
        }

        // Validar que los números sean positivos
        if (poder < 0 || ACC < 0 || PP < 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los valores de poder, ACC y PP deben ser positivos'
            });
        }

        // Verificar si ya existe un movimiento con el mismo nombre
        const movimientoExistente = await Movimiento.findOne({ where: { nombre } });
        if (movimientoExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un movimiento con ese nombre'
            });
        }

        const nuevoMovimiento = await Movimiento.create({
            nombre,
            id_tipo: Number(id_tipo),
            id_cat: Number(id_cat),
            poder: Number(poder),
            ACC: Number(ACC),
            PP: Number(PP),
            descripcion
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Movimiento creado exitosamente',
            datos: nuevoMovimiento
        });
    } catch (error) {
        console.error('Error al crear movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un movimiento
const actualizarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, id_tipo, id_cat, poder, ACC, PP, descripcion } = req.body;

        const movimiento = await Movimiento.findByPk(id);

        if (!movimiento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Movimiento no encontrado'
            });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo el movimiento actual)
        if (nombre && nombre !== movimiento.nombre) {
            const movimientoExistente = await Movimiento.findOne({ 
                where: { nombre },
                raw: true
            });
            if (movimientoExistente && movimientoExistente.id_movimiento !== parseInt(id)) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe un movimiento con ese nombre'
                });
            }
        }

        // Validar números si se proporcionan
        if ((poder !== undefined && poder < 0) || 
            (ACC !== undefined && ACC < 0) || 
            (PP !== undefined && PP < 0)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los valores de poder, ACC y PP deben ser positivos'
            });
        }

        // Actualizar solo los campos proporcionados
        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (id_tipo !== undefined) datosActualizados.id_tipo = Number(id_tipo);
        if (id_cat !== undefined) datosActualizados.id_cat = Number(id_cat);
        if (poder !== undefined) datosActualizados.poder = Number(poder);
        if (ACC !== undefined) datosActualizados.ACC = Number(ACC);
        if (PP !== undefined) datosActualizados.PP = Number(PP);
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;

        await movimiento.update(datosActualizados);

        // Obtener el movimiento actualizado
        const movimientoActualizado = await Movimiento.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Movimiento actualizado exitosamente',
            datos: movimientoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar movimiento:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un movimiento
const eliminarMovimiento = async (req, res) => {
    try {
        const { id } = req.params;

        const movimiento = await Movimiento.findByPk(id);

        if (!movimiento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Movimiento no encontrado'
            });
        }

        await movimiento.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Movimiento eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar movimiento:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el movimiento porque está siendo utilizado por otros registros'
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
    obtenerTodosLosMovimientos,
    obtenerMovimientoPorId,
    crearMovimiento,
    actualizarMovimiento,
    eliminarMovimiento
};
