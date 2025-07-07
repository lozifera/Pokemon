const { Detalle } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes de detalles
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'src/public/uploads/detalles'; // Carpeta donde se guardarán las imágenes de detalles
        // Verifica si la carpeta existe, si no, la crea
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Crea la carpeta y subcarpetas si no existen
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    },
});

// Configuración de multer con filtros para imágenes
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        // Validar que el archivo sea una imagen PNG o JPG
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PNG, JPG o JPEG'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

// Obtener todos los detalles
const obtenerTodosLosDetalles = async (req, res) => {
    try {
        const detalles = await Detalle.findAll({
            order: [['id_detalle', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Detalles obtenidos exitosamente',
            datos: detalles
        });
    } catch (error) {
        console.error('Error al obtener detalles:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener detalle por ID
const obtenerDetallePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await Detalle.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Detalle no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Detalle obtenido exitosamente',
            datos: detalle
        });
    } catch (error) {
        console.error('Error al obtener detalle:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo detalle
const crearDetalle = async (req, res) => {
    try {
        const { nivel, genero, brillante, Tipo_tera } = req.body;

        // Validar campos requeridos
        if (nivel === undefined || !genero || brillante === undefined || 
            Tipo_tera === undefined) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nivel, genero, brillante, Tipo_tera)'
            });
        }

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere una imagen del detalle (PNG, JPG o JPEG)'
            });
        }

        // Validar nivel
        if (!Number.isInteger(Number(nivel)) || Number(nivel) < 1 || Number(nivel) > 100) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El nivel debe ser un número entero entre 1 y 100'
            });
        }

        // Validar género
        const generosValidos = ['masculino', 'femenino', 'desconocido'];
        if (!generosValidos.includes(genero)) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El género debe ser: masculino, femenino o desconocido'
            });
        }

        // Validar brillante (debe ser booleano)
        if (typeof brillante !== 'boolean' && brillante !== 'true' && brillante !== 'false') {
            return res.status(400).json({
                exito: false,
                mensaje: 'El campo brillante debe ser verdadero o falso'
            });
        }

        // Validar Tipo_tera
        if (!Number.isInteger(Number(Tipo_tera)) || Number(Tipo_tera) < 1) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El tipo tera debe ser un número entero positivo'
            });
        }

        // Datos del archivo subido
        const fileName = req.file.filename;
        const imgPath = `uploads/detalles/${fileName}`;

        const nuevoDetalle = await Detalle.create({
            nivel: Number(nivel),
            genero: genero,
            brillante: brillante === true || brillante === 'true',
            Tipo_tera: Number(Tipo_tera),
            path: imgPath,
            file_name: fileName
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Detalle creado exitosamente',
            datos: nuevoDetalle
        });
    } catch (error) {
        console.error('Error al crear detalle:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'El tipo tera especificado no existe'
            });
        }

        // Manejar errores de validación de ENUM
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'Datos inválidos proporcionados'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar detalle
const actualizarDetalle = async (req, res) => {
    try {
        const { id } = req.params;
        const { nivel, genero, brillante, Tipo_tera } = req.body;

        const detalle = await Detalle.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Detalle no encontrado'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            nivel: detalle.nivel,
            genero: detalle.genero,
            brillante: detalle.brillante,
            Tipo_tera: detalle.Tipo_tera,
            path: detalle.path,
            file_name: detalle.file_name
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };

        if (nivel !== undefined) {
            if (!Number.isInteger(Number(nivel)) || Number(nivel) < 1 || Number(nivel) > 100) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nivel debe ser un número entero entre 1 y 100'
                });
            }
            valoresNuevos.nivel = Number(nivel);
        }

        if (genero !== undefined) {
            const generosValidos = ['masculino', 'femenino', 'desconocido'];
            if (!generosValidos.includes(genero)) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El género debe ser: masculino, femenino o desconocido'
                });
            }
            valoresNuevos.genero = genero;
        }

        if (brillante !== undefined) {
            if (typeof brillante !== 'boolean' && brillante !== 'true' && brillante !== 'false') {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El campo brillante debe ser verdadero o falso'
                });
            }
            valoresNuevos.brillante = brillante === true || brillante === 'true';
        }

        if (Tipo_tera !== undefined) {
            if (!Number.isInteger(Number(Tipo_tera)) || Number(Tipo_tera) < 1) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El tipo tera debe ser un número entero positivo'
                });
            }
            valoresNuevos.Tipo_tera = Number(Tipo_tera);
        }

        // Si se subió una nueva imagen, actualizar path y file_name
        if (req.file) {
            const fileName = req.file.filename;
            const imgPath = `uploads/detalles/${fileName}`;
            valoresNuevos.path = imgPath;
            valoresNuevos.file_name = fileName;
        }

        await detalle.update(valoresNuevos);

        // Obtener el detalle actualizado
        const detalleActualizado = await Detalle.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Detalle actualizado exitosamente',
            datos: detalleActualizado
        });
    } catch (error) {
        console.error('Error al actualizar detalle:', error);
        
        // Manejar errores de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'El tipo tera especificado no existe'
            });
        }

        // Manejar errores de validación de ENUM
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                exito: false,
                mensaje: 'Datos inválidos proporcionados'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar detalle
const eliminarDetalle = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await Detalle.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Detalle no encontrado'
            });
        }

        await detalle.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Detalle eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar detalle:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el detalle porque está siendo utilizado por otros registros'
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
    obtenerTodosLosDetalles,
    obtenerDetallePorId,
    crearDetalle,
    actualizarDetalle,
    eliminarDetalle,
    upload
};