const { Tipo } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes de tipos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'src/public/uploads/tipos'; // Carpeta donde se guardarán las imágenes de tipos
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

// Obtener todos los tipos
const obtenerTipos = async (req, res) => {
    try {
        const tipos = await Tipo.findAll({
            order: [['id_tipo', 'ASC']]
        });

        res.status(200).json({
            success: true,
            message: 'Tipos obtenidos exitosamente',
            data: tipos
        });
    } catch (error) {
        console.error('Error al obtener tipos:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un tipo por ID
const obtenerTipoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const tipo = await Tipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({
                success: false,
                message: 'Tipo no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tipo obtenido exitosamente',
            data: tipo
        });
    } catch (error) {
        console.error('Error al obtener tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo tipo
const crearTipo = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validar campos requeridos
        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El campo nombre es requerido'
            });
        }

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere una imagen del tipo (PNG, JPG o JPEG)'
            });
        }

        // Validar que el nombre no esté vacío
        if (nombre.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del tipo no puede estar vacío'
            });
        }

        // Validar longitud del nombre
        if (nombre.length > 255) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del tipo no puede exceder 255 caracteres'
            });
        }

        // Verificar si ya existe un tipo con el mismo nombre
        const tipoExistente = await Tipo.findOne({ where: { nombre: nombre.trim() } });
        if (tipoExistente) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un tipo con ese nombre'
            });
        }

        // Datos del archivo subido
        const fileName = req.file.filename;
        const imgPath = `uploads/tipos/${fileName}`;

        const nuevoTipo = await Tipo.create({
            nombre: nombre.trim(),
            path: imgPath,
            file_name: fileName
        });

        res.status(201).json({
            success: true,
            message: 'Tipo creado exitosamente',
            data: nuevoTipo
        });
    } catch (error) {
        console.error('Error al crear tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un tipo
const actualizarTipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const tipo = await Tipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({
                success: false,
                message: 'Tipo no encontrado'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            nombre: tipo.nombre,
            path: tipo.path,
            file_name: tipo.file_name
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };

        if (nombre !== undefined) {
            // Validar nombre
            if (nombre.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre del tipo no puede estar vacío'
                });
            }
            if (nombre.length > 255) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre del tipo no puede exceder 255 caracteres'
                });
            }

            // Verificar si el nuevo nombre ya existe (excluyendo el tipo actual)
            const nombreTrimmed = nombre.trim();
            if (nombreTrimmed !== tipo.nombre) {
                const tipoExistente = await Tipo.findOne({ 
                    where: { nombre: nombreTrimmed },
                    raw: true
                });
                if (tipoExistente && tipoExistente.id_tipo !== parseInt(id)) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe un tipo con ese nombre'
                    });
                }
            }
            valoresNuevos.nombre = nombreTrimmed;
        }

        // Si se subió una nueva imagen, actualizar path y file_name
        if (req.file) {
            const fileName = req.file.filename;
            const imgPath = `uploads/tipos/${fileName}`;
            valoresNuevos.path = imgPath;
            valoresNuevos.file_name = fileName;
        }

        await tipo.update(valoresNuevos);

        // Obtener el tipo actualizado
        const tipoActualizado = await Tipo.findByPk(id);

        res.status(200).json({
            success: true,
            message: 'Tipo actualizado exitosamente',
            data: tipoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar tipo:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un tipo
const eliminarTipo = async (req, res) => {
    try {
        const { id } = req.params;

        const tipo = await Tipo.findByPk(id);

        if (!tipo) {
            return res.status(404).json({
                success: false,
                message: 'Tipo no encontrado'
            });
        }

        await tipo.destroy();

        res.status(200).json({
            success: true,
            message: 'Tipo eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar tipo:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'No se puede eliminar el tipo porque está siendo utilizado por otros registros'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTipos,
    obtenerTipoPorId,
    crearTipo,
    actualizarTipo,
    eliminarTipo,
    upload
};
