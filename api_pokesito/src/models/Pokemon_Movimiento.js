const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pokemon_Movimiento',{
        id_pokemon: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_movimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    },{
        tableName: 'pokemon_movimiento',
        timestamps: false
    })
}