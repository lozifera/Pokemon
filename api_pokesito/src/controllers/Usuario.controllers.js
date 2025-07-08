const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generar JWT Token
const generateToken = (usuario) => {
    return jwt.sign(
        { 
            id: usuario.id_usuario, 
            correo: usuario.correo, 
            admin: usuario.admin 
        },
        process.env.JWT_SECRET || 'tu_clave_secreta_aqui',
        { expiresIn: '24h' }
    );
};

// LOGIN
const loginUsuario = async (req, res) => {
    try {
        const { correo, contraseña } = req.body;

        // Validar campos requeridos
        if (!correo || !contraseña) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son requeridos'
            });
        }

        // Buscar usuario por correo
        const usuario = await Usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        // Generar token
        const token = generateToken(usuario);

        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                token,
                usuario: {
                    id: usuario.id_usuario,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo,
                    admin: usuario.admin
                }
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// CREAR USUARIO (REGISTRO)
const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, correo, contraseña, admin = false } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !correo || !contraseña) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el correo ya existe
        const usuarioExistente = await Usuario.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está registrado'
            });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 12);

        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombre,
            apellido,
            correo,
            contraseña: hashedPassword,
            admin
        });

        // Generar token
        const token = generateToken(nuevoUsuario);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: {
                token,
                usuario: {
                    id: nuevoUsuario.id_usuario,
                    nombre: nuevoUsuario.nombre,
                    apellido: nuevoUsuario.apellido,
                    correo: nuevoUsuario.correo,
                    admin: nuevoUsuario.admin
                }
            }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// OBTENER TODOS LOS USUARIOS (Solo admin)
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['contraseña'] },
            order: [['id_usuario', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// OBTENER USUARIO POR ID
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: { exclude: ['contraseña'] }
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// ACTUALIZAR USUARIO
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, contraseña, admin } = req.body;
        const usuarioLogueado = req.usuario;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si el nuevo correo ya existe (si se está cambiando)
        if (correo && correo !== usuario.correo) {
            const correoExistente = await Usuario.findOne({ where: { correo } });
            if (correoExistente) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo ya está registrado'
                });
            }
        }

        // Actualizar campos
        if (nombre) usuario.nombre = nombre;
        if (apellido) usuario.apellido = apellido;
        if (correo) usuario.correo = correo;
        if (contraseña) {
            usuario.contraseña = await bcrypt.hash(contraseña, 12);
        }
        
        // Solo admin puede cambiar el rol admin
        if (admin !== undefined && usuarioLogueado.admin) {
            usuario.admin = admin;
        }

        await usuario.save();

        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                admin: usuario.admin
            }
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// ELIMINAR USUARIO (Solo admin)
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioLogueado = req.usuario;

        // Solo admin puede eliminar usuarios
        if (!usuarioLogueado.admin) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar usuarios'
            });
        }

        // No puede eliminarse a sí mismo
        if (usuarioLogueado.id === parseInt(id)) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        await usuario.destroy();
        res.status(200).json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// OBTENER PERFIL DEL USUARIO LOGUEADO
const obtenerPerfil = async (req, res) => {
    try {
        const usuarioLogueado = req.usuario;
        
        const usuario = await Usuario.findByPk(usuarioLogueado.id, {
            attributes: { exclude: ['contraseña'] }
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Cambiar contraseña
const cambiarContrasena = async (req, res) => {
    try {
        const { id } = req.params;
        const { contrasenaActual, contrasenaNueva, confirmarContrasena } = req.body;
        const usuarioLogueado = req.usuario;

        // Validar campos requeridos
        if (!contrasenaActual || !contrasenaNueva || !confirmarContrasena) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos (contrasenaActual, contrasenaNueva, confirmarContrasena)'
            });
        }

        // Validar que las contraseñas nuevas coincidan
        if (contrasenaNueva !== confirmarContrasena) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña y la confirmación no coinciden'
            });
        }

        // Validar longitud de la nueva contraseña
        if (contrasenaNueva.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar permisos: solo el mismo usuario o admin
        if (usuarioLogueado.id !== parseInt(id) && !usuarioLogueado.admin) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para cambiar esta contraseña'
            });
        }

        // Buscar el usuario
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar contraseña actual (solo si no es admin cambiando otra contraseña)
        if (usuarioLogueado.id === parseInt(id)) {
            const isValidCurrentPassword = await bcrypt.compare(contrasenaActual, usuario.contraseña);
            if (!isValidCurrentPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña actual es incorrecta'
                });
            }
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(contrasenaNueva, salt);

        // Actualizar contraseña
        await usuario.update({ contraseña: hashedNewPassword });

        res.status(200).json({
            success: true,
            message: 'Contraseña cambiada exitosamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

module.exports = {
    loginUsuario,
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuarioPorId,
    actualizarUsuario,
    eliminarUsuario,
    obtenerPerfil,
    cambiarContrasena
};