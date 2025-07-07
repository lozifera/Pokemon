const express = require('express');
const router = express.Router();
const {
    loginUsuario,
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil
} = require('../controllers/Usuario.controllers');

const {
    verificarToken,
    verificarAdmin,
    verificarUsuarioOAdmin
} = require('../middlewares/auth.middleware');

// RUTAS PÚBLICAS (sin autenticación)
router.post('/login', loginUsuario);
router.post('/registro', crearUsuario);

// RUTAS PROTEGIDAS (requieren token)
router.get('/perfil', verificarToken, obtenerPerfil);
router.get('/:id', verificarToken, verificarUsuarioOAdmin, obtenerUsuarioPorId);
router.put('/:id', verificarToken, verificarUsuarioOAdmin, actualizarUsuario);

// RUTAS SOLO ADMIN (requieren token + permisos admin)
router.get('/', verificarToken, verificarAdmin, obtenerUsuarios);
router.delete('/:id', verificarToken, verificarAdmin, eliminarUsuario);

module.exports = router;