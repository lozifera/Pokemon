const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../models');
const Cat = db.Cat;

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'src/public/uploads/cats';
        // Verifica si la carpeta existe, si no, la crea
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cat-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PNG y JPG'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Obtener todas las categorías
const obtenerTodos = async (req, res) => {
    try {
        const categorias = await Cat.findAll();
        
        // Verificar si los archivos existen y marcar los que faltan
        const categoriasConEstado = categorias.map(categoria => {
            const categoriaData = categoria.toJSON();
            if (categoriaData.path && categoriaData.file_name) {
                const filePath = path.join('src/public', categoriaData.path);
                categoriaData.fileExists = fs.existsSync(filePath);
            }
            return categoriaData;
        });
        
        res.status(200).json({
            mensaje: 'Categorías obtenidas exitosamente',
            datos: categoriasConEstado
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener las categorías',
            error: error.message
        });
    }
};

// Obtener categoría por ID
const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Cat.findByPk(id);
        
        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }
        
        res.status(200).json({
            mensaje: 'Categoría obtenida exitosamente',
            datos: categoria
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener la categoría',
            error: error.message
        });
    }
};

// Crear nueva categoría
const crear = async (req, res) => {
    try {
        const { nombre } = req.body;
        
        if (!nombre) {
            return res.status(400).json({
                mensaje: 'El nombre es requerido'
            });
        }

        // Verificar que se subió un archivo
        if (!req.file) {
            return res.status(400).json({
                mensaje: 'La imagen es requerida'
            });
        }

        // Verificar si ya existe una categoría con ese nombre
        const categoriaExistente = await Cat.findOne({
            where: { nombre: nombre }
        });

        if (categoriaExistente) {
            return res.status(400).json({
                mensaje: 'Ya existe una categoría con ese nombre'
            });
        }

        const nuevaCategoria = await Cat.create({
            nombre,
            path: `uploads/cats/${req.file.filename}`,
            file_name: req.file.filename
        });
        
        res.status(201).json({
            mensaje: 'Categoría creada exitosamente',
            datos: nuevaCategoria
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                mensaje: 'Ya existe una categoría con ese nombre'
            });
        }
        res.status(500).json({
            mensaje: 'Error al crear la categoría',
            error: error.message
        });
    }
};

// Actualizar categoría
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        
        const categoria = await Cat.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }

        // Verificar si el nuevo nombre ya existe (si se está cambiando)
        if (nombre && nombre !== categoria.nombre) {
            const categoriaExistente = await Cat.findOne({
                where: { nombre: nombre }
            });

            if (categoriaExistente) {
                return res.status(400).json({
                    mensaje: 'Ya existe una categoría con ese nombre'
                });
            }
        }

        const datosActualizacion = {};
        if (nombre) datosActualizacion.nombre = nombre;
        
        // Si se subió una nueva imagen
        if (req.file) {
            datosActualizacion.path = `uploads/cats/${req.file.filename}`;
            datosActualizacion.file_name = req.file.filename;
        }

        await categoria.update(datosActualizacion);
        
        res.status(200).json({
            mensaje: 'Categoría actualizada exitosamente',
            datos: categoria
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                mensaje: 'Ya existe una categoría con ese nombre'
            });
        }
        res.status(500).json({
            mensaje: 'Error al actualizar la categoría',
            error: error.message
        });
    }
};

// Eliminar categoría
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const categoria = await Cat.findByPk(id);
        if (!categoria) {
            return res.status(404).json({
                mensaje: 'Categoría no encontrada'
            });
        }
        
        await categoria.destroy();
        
        res.status(200).json({
            mensaje: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                mensaje: 'No se puede eliminar la categoría porque está siendo utilizada por otros elementos'
            });
        }
        res.status(500).json({
            mensaje: 'Error al eliminar la categoría',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodasLasCategorias: obtenerTodos,
    obtenerCategoriaPorId: obtenerPorId,
    crearCategoria: crear,
    actualizarCategoria: actualizar,
    eliminarCategoria: eliminar,
    upload
};