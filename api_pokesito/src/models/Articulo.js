const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Articulo', {
        id_articulo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(255),
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
        tableName: 'Articulo',
        timestamps: false
    });
};
