const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pokemon_Habilidad', {
        id_pokemon: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_habilidad: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('oculta', 'normal'),
            allowNull: false
        }
    }, {
        tableName: 'Pokemon_Habilidad',
        timestamps: false
    });
};
