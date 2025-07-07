const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Naturaleza', {
        id_naturaleza: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        sube_stat: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        baja_stat: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Naturaleza',
        timestamps: false
    });
};
