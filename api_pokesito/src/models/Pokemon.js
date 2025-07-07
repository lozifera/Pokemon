const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Pokemon', {
        id_pokemon: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre_pok: {
            type: DataTypes.STRING(255),
            allowNull: false
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
        path: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Pokemon',
        timestamps: false
    });
};
