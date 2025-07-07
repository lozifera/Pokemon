const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// Middleware para verificar token JWT
const verificarToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Acceso denegado. No hay token proporcionado.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_aqui');
        
        // Verificar que el usuario aún existe
        const usuario = await Usuario.findByPk(decoded.id);
        if (!usuario) {
            return res.status(401).json({ 
                success: false,
                message: 'Token inválido. Usuario no encontrado.' 
            });
        }

        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false,
            message: 'Token inválido' 
        });
    }
};

// Middleware para verificar si es administrador
const verificarAdmin = (req, res, next) => {
    if (!req.usuario.admin) {
        return res.status(403).json({ 
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador.' 
        });
    }
    next();
};

// Middleware para verificar si es el mismo usuario o admin
const verificarUsuarioOAdmin = (req, res, next) => {
    const { id } = req.params;
    const usuarioLogueado = req.usuario;

    if (!usuarioLogueado.admin && usuarioLogueado.id !== parseInt(id)) {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }
    next();
};

module.exports = {
    verificarToken,
    verificarAdmin,
    verificarUsuarioOAdmin
};
