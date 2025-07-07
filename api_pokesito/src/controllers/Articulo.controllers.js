const { Articulo } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes de artículos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'src/public/uploads/articulos'; // Carpeta donde se guardarán las imágenes de artículos
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

// Obtener todos los artículos
const obtenerTodosLosArticulos = async (req, res) => {
    try {
        const articulos = await Articulo.findAll({
            order: [['id_articulo', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Artículos obtenidos exitosamente',
            datos: articulos
        });
    } catch (error) {
        console.error('Error al obtener artículos:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener artículo por ID
const obtenerArticuloPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const articulo = await Articulo.findByPk(id);

        if (!articulo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Artículo no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Artículo obtenido exitosamente',
            datos: articulo
        });
    } catch (error) {
        console.error('Error al obtener artículo:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear nuevo artículo
const crearArticulo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        // Validar campos requeridos
        if (!nombre || !descripcion) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nombre, descripcion)'
            });
        }

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere una imagen del artículo (PNG, JPG o JPEG)'
            });
        }

        // Validar que los campos no estén vacíos
        if (nombre.trim().length === 0 || descripcion.trim().length === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre y descripción deben tener contenido válido'
            });
        }

        // Validar longitud de campos
        if (nombre.length > 255 || descripcion.length > 255) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre y descripción no pueden exceder 255 caracteres'
            });
        }

        // Datos del archivo subido
        const fileName = req.file.filename;
        const imgPath = `uploads/articulos/${fileName}`;

        const nuevoArticulo = await Articulo.create({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            path: imgPath,
            file_name: fileName
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Artículo creado exitosamente',
            datos: nuevoArticulo
        });
    } catch (error) {
        console.error('Error al crear artículo:', error);
        
        // Manejar errores de unicidad si los hay
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un artículo con ese nombre'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar artículo
const actualizarArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const articulo = await Articulo.findByPk(id);

        if (!articulo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Artículo no encontrado'
            });
        }

        // Crear objeto con los valores actuales
        const valoresActuales = {
            nombre: articulo.nombre,
            descripcion: articulo.descripcion,
            path: articulo.path,
            file_name: articulo.file_name
        };

        // Actualizar con los nuevos valores si se proporcionan
        const valoresNuevos = { ...valoresActuales };

        if (nombre !== undefined) {
            if (nombre.trim().length === 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre no puede estar vacío'
                });
            }
            if (nombre.length > 255) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'El nombre no puede exceder 255 caracteres'
                });
            }
            valoresNuevos.nombre = nombre.trim();
        }

        if (descripcion !== undefined) {
            if (descripcion.trim().length === 0) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La descripción no puede estar vacía'
                });
            }
            if (descripcion.length > 255) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'La descripción no puede exceder 255 caracteres'
                });
            }
            valoresNuevos.descripcion = descripcion.trim();
        }

        // Si se subió una nueva imagen, actualizar path y file_name
        if (req.file) {
            const fileName = req.file.filename;
            const imgPath = `uploads/articulos/${fileName}`;
            valoresNuevos.path = imgPath;
            valoresNuevos.file_name = fileName;
        }

        await articulo.update(valoresNuevos);

        // Obtener el artículo actualizado
        const articuloActualizado = await Articulo.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Artículo actualizado exitosamente',
            datos: articuloActualizado
        });
    } catch (error) {
        console.error('Error al actualizar artículo:', error);
        
        // Manejar errores de unicidad si los hay
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un artículo con ese nombre'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar artículo
const eliminarArticulo = async (req, res) => {
    try {
        const { id } = req.params;

        const articulo = await Articulo.findByPk(id);

        if (!articulo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Artículo no encontrado'
            });
        }

        await articulo.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Artículo eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar artículo:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el artículo porque está siendo utilizado por Pokémon de equipos'
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
    obtenerTodosLosArticulos,
    obtenerArticuloPorId,
    crearArticulo,
    actualizarArticulo,
    eliminarArticulo,
    upload
};