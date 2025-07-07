const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pokemon_Tipo', {
        id_pokemon: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_tipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
        tableName: 'Pokemon_Tipo',
        timestamps: false
    });
};
