const express = require('express');
const router = express.Router();
const {
    obtenerTodosLosPokemon,
    obtenerPokemonPorId,
    crearPokemon,
    actualizarPokemon,
    eliminarPokemon,
    buscarPokemonPorNombre,
    upload
} = require('../controllers/Pokemon.controllers');

// RUTAS PARA POKÉMON
// GET /api/pokemon - Obtener todos los pokémon
router.get('/', obtenerTodosLosPokemon);

// GET /api/pokemon/buscar?nombre=pikachu - Buscar pokémon por nombre
router.get('/buscar', buscarPokemonPorNombre);

// GET /api/pokemon/:id - Obtener un pokémon por ID
router.get('/:id', obtenerPokemonPorId);

// POST /api/pokemon - Crear un nuevo pokémon (con imagen)
router.post('/', upload.single('imagen'), crearPokemon);

// PUT /api/pokemon/:id - Actualizar un pokémon (con imagen opcional)
router.put('/:id', upload.single('imagen'), actualizarPokemon);

// DELETE /api/pokemon/:id - Eliminar un pokémon
router.delete('/:id', eliminarPokemon);

// GET /api/pokemon/:id/imagen - Obtener la imagen de un pokémon
router.get('/:id/imagen', async (req, res) => {
    try {
        const { Pokemon } = require('../models');
        const { id } = req.params;
        
        const pokemon = await Pokemon.findByPk(id);
        
        if (!pokemon) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Pokémon no encontrado'
            });
        }
        
        if (!pokemon.path) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Este Pokémon no tiene imagen'
            });
        }
        
        // Construir la URL completa de la imagen
        const imageUrl = `${req.protocol}://${req.get('host')}/${pokemon.path}`;
        
        res.status(200).json({
            exito: true,
            mensaje: 'URL de imagen obtenida exitosamente',
            datos: {
                pokemon_id: pokemon.id_pokemon,
                nombre_pok: pokemon.nombre_pok,
                image_url: imageUrl,
                file_name: pokemon.file_name
            }
        });
    } catch (error) {
        console.error('Error al obtener imagen de pokémon:', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error interno del servidor',
            error: error.message
        });
    }
});

module.exports = router;
