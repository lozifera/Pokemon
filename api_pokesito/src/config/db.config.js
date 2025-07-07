const { Sequelize } = require('sequelize');
const { Pool } = require('pg');

const sequelize = new Sequelize({
    dialect:'postgres',
    database:'Pokemon',
    username:'postgres',
    password:'loza',
    host:'localhost',
    port: 5432,
    logging: console.log
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    sequelize, Sequelize
}; 