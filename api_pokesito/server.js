const app = require('./src/app');
const { sequelize } = require('./src/config/db.config');
require('./src/models');

const port = 3001;

// Sincronizar modelos con la base de datos
    sequelize.sync({ force: false }) // Cambia a `true` si necesitas recrear las tablas
    .then(() => {
        console.log('Tablas sincronizadas correctamente.');
        //return sequelize.getQueryInterface().showAllTables();
    })
    .then(() => {
        //console.log('Tablas en la base de datos:', tables);
    })
    .catch((err) => {
        console.error('Error al sincronizar las tablas:', err);
    });
    // Iniciar el servidor
app.listen(port, () => {
console.log(`API corriendo en http://localhost:${port}`);
});