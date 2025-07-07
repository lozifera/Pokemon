const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Usuario', {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        apellido: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        correo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        contraseña: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'Usuario',
        timestamps: false
    });
};
