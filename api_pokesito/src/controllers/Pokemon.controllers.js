const { Pokemon } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'src/public/uploads/pokemon'; // Carpeta donde se guardarán las imágenes de Pokémon
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

// Obtener todos los pokémon
const obtenerTodosLosPokemon = async (req, res) => {
    try {
        const pokemon = await Pokemon.findAll({
            order: [['id_pokemon', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon obtenidos exitosamente',
            datos: pokemon
        });
    } catch (error) {
        console.error('Error al obtener pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener un pokémon por ID
const obtenerPokemonPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon no encontrado'
            });
        }

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon obtenido exitosamente',
            datos: pokemon
        });
    } catch (error) {
        console.error('Error al obtener pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Crear un nuevo pokémon
const crearPokemon = async (req, res) => {
    try {
        console.log('=== DEBUG CREAR POKEMON ===');
        console.log('Headers:', req.headers);
        console.log('req.body:', req.body);
        console.log('req.file:', req.file);
        console.log('Tipo de req.body:', typeof req.body);
        console.log('Keys de req.body:', Object.keys(req.body));
        console.log('===========================');
        
        const { 
            nombre_pok, 
            HP, 
            ataque, 
            defensa, 
            sp_ataque, 
            sp_defensa, 
            velocidad
        } = req.body;

        // Validar campos requeridos
        if (!nombre_pok || HP === undefined || ataque === undefined || 
            defensa === undefined || sp_ataque === undefined || 
            sp_defensa === undefined || velocidad === undefined) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Todos los campos son requeridos (nombre_pok, HP, ataque, defensa, sp_ataque, sp_defensa, velocidad)'
            });
        }

        // Validar que se haya subido una imagen
        if (!req.file) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Se requiere una imagen del Pokémon (PNG, JPG o JPEG)'
            });
        }

        // Validar que las estadísticas sean números positivos
        const estadisticas = [HP, ataque, defensa, sp_ataque, sp_defensa, velocidad];
        if (estadisticas.some(stat => stat < 0 || !Number.isInteger(Number(stat)))) {
            return res.status(400).json({
                exito: false,
                mensaje: 'Las estadísticas deben ser números enteros positivos'
            });
        }

        // Verificar si ya existe un pokémon con el mismo nombre
        const pokemonExistente = await Pokemon.findOne({ where: { nombre_pok } });
        if (pokemonExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un pokémon con ese nombre'
            });
        }

        // Datos del archivo subido
        const fileName = req.file.filename;
        const imgPath = `uploads/pokemon/${fileName}`;

        const nuevoPokemon = await Pokemon.create({
            nombre_pok,
            HP: Number(HP),
            ataque: Number(ataque),
            defensa: Number(defensa),
            sp_ataque: Number(sp_ataque),
            sp_defensa: Number(sp_defensa),
            velocidad: Number(velocidad),
            path: imgPath,
            file_name: fileName
        });

        res.status(201).json({
            exito: true,
            mensaje: 'Pokémon creado exitosamente',
            datos: nuevoPokemon
        });
    } catch (error) {
        console.error('Error al crear pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Actualizar un pokémon
const actualizarPokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nombre_pok, 
            HP, 
            ataque, 
            defensa, 
            sp_ataque, 
            sp_defensa, 
            velocidad
        } = req.body;

        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon no encontrado'
            });
        }

        // Verificar si el nuevo nombre ya existe (excluyendo el pokémon actual)
        if (nombre_pok && nombre_pok !== pokemon.nombre_pok) {
            const pokemonExistente = await Pokemon.findOne({ 
                where: { nombre_pok },
                raw: true
            });
            if (pokemonExistente && pokemonExistente.id_pokemon !== parseInt(id)) {
                return res.status(409).json({
                    exito: false,
                    mensaje: 'Ya existe un pokémon con ese nombre'
                });
            }
        }

        // Validar estadísticas si se proporcionan
        const estadisticasParaValidar = [HP, ataque, defensa, sp_ataque, sp_defensa, velocidad]
            .filter(stat => stat !== undefined);
        
        if (estadisticasParaValidar.length > 0) {
            if (estadisticasParaValidar.some(stat => stat < 0 || !Number.isInteger(Number(stat)))) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Las estadísticas deben ser números enteros positivos'
                });
            }
        }

        // Actualizar solo los campos proporcionados
        const datosActualizados = {};
        if (nombre_pok !== undefined) datosActualizados.nombre_pok = nombre_pok;
        if (HP !== undefined) datosActualizados.HP = Number(HP);
        if (ataque !== undefined) datosActualizados.ataque = Number(ataque);
        if (defensa !== undefined) datosActualizados.defensa = Number(defensa);
        if (sp_ataque !== undefined) datosActualizados.sp_ataque = Number(sp_ataque);
        if (sp_defensa !== undefined) datosActualizados.sp_defensa = Number(sp_defensa);
        if (velocidad !== undefined) datosActualizados.velocidad = Number(velocidad);

        // Si se subió una nueva imagen, actualizar path y file_name
        if (req.file) {
            const fileName = req.file.filename;
            const imgPath = `uploads/pokemon/${fileName}`;
            datosActualizados.path = imgPath;
            datosActualizados.file_name = fileName;
        }

        await pokemon.update(datosActualizados);

        // Obtener el pokémon actualizado
        const pokemonActualizado = await Pokemon.findByPk(id);

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon actualizado exitosamente',
            datos: pokemonActualizado
        });
    } catch (error) {
        console.error('Error al actualizar pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Eliminar un pokémon
const eliminarPokemon = async (req, res) => {
    try {
        const { id } = req.params;

        const pokemon = await Pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon no encontrado'
            });
        }

        await pokemon.destroy();

        res.status(200).json({
            exito: true,
            mensaje: 'Pokémon eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar pokémon:', error);
        
        // Manejar errores de restricción de clave foránea
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el pokémon porque está siendo utilizado por otros registros'
            });
        }

        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Buscar pokémon por nombre
const buscarPokemonPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;

        if (!nombre) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El parámetro nombre es requerido'
            });
        }

        const pokemon = await Pokemon.findAll({
            where: {
                nombre_pok: {
                    [require('sequelize').Op.iLike]: `%${nombre}%`
                }
            },
            order: [['nombre_pok', 'ASC']]
        });

        res.status(200).json({
            exito: true,
            mensaje: `Se encontraron ${pokemon.length} pokémon que coinciden con la búsqueda`,
            datos: pokemon
        });
    } catch (error) {
        console.error('Error al buscar pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTodosLosPokemon,
    obtenerPokemonPorId,
    crearPokemon,
    actualizarPokemon,
    eliminarPokemon,
    buscarPokemonPorNombre,
    upload
};
