const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Evs', {
        id_evs: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        HP: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ataque: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defensa: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sp_ataque: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sp_defensa: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        velocidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Evs',
        timestamps: false
    });
};
