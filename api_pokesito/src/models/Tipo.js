const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Tipo', {
        id_tipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
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
        tableName: 'Tipo',
        timestamps: false
    });
};
