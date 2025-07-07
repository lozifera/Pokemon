const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Detalle', {
        id_detalle: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nivel: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        genero: {
            type: DataTypes.ENUM('masculino', 'femenino', 'desconocido'),
            allowNull: false
        },
        brillante: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        Tipo_tera: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Detalle',
        timestamps: false
    });
};
