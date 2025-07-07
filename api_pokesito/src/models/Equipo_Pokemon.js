const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Equipo_Pokemon', {
        id_equipo_pokemon: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_equipo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nombre_pok: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        apodo_pok: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        img_pok: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        id_pokemon: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_detalle: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_articulo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_estadisticas: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_habilidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'Equipo_Pokemon',
        timestamps: false
    });
};
