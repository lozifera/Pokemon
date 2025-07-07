const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Equipo', {
        id_equipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Equipo',
        timestamps: false
    });
};
