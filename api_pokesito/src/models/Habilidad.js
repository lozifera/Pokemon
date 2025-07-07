const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Habilidad', {
        id_habilidad: {
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
        }
    }, {
        tableName: 'Habilidad',
        timestamps: false
    });
};
