const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Estadisticas', {
        id_estadisticas: {
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
        },
        id_evs: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_ivs: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_naturaleza: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Estadisticas',
        timestamps: false
    });
};
