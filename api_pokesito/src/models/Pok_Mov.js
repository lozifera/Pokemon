const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pok_Mov', {
        id_equipo_pokemon: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_movimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        slot: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, 2, 3, 4]]
            }
        }
    }, {
        tableName: 'pok_mov',
        timestamps: false
    });
};
