const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Movimiento', {
        id_movimiento: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        id_tipo: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_cat: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        poder: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ACC: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        PP: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'Movimiento',
        timestamps: false
    });
};
