const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

const corsOptions = {
  origin: '*', // Cambia esto al dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
const usuarioRoutes = require('./routes/Usuario.route');
const tipoRoutes = require('./routes/Tipo.route');
const pokemonRoutes = require('./routes/Pokemon.route');
const pokemonTipoRoutes = require('./routes/Pokemon_Tipo.route');
const pokemonMovimientoRoutes = require('./routes/Pokemon_Movimiento.route');
const pokemonHabilidadRoutes = require('./routes/Pokemon_Habilidad.route');
const pokMovRoutes = require('./routes/Pok_Mov.route');
const naturalezaRoutes = require('./routes/Naturaleza.route');
const movimientoRoutes = require('./routes/Movimiento.route');
const ivsRoutes = require('./routes/Ivs.route');
const habilidadRoutes = require('./routes/Habilidad.route');
const evsRoutes = require('./routes/Evs.route');
const estadisticasRoutes = require('./routes/Estadisticas.route');
const equipoRoutes = require('./routes/Equipo.route');
const equipoPokemonRoutes = require('./routes/Equipo_Pokemon.route');
const detalleRoutes = require('./routes/Detalle.route');
const articuloRoutes = require('./routes/Articulo.route');
const catRoutes = require('./routes/Cat.route');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tipos', tipoRoutes);
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/pokemon-tipo', pokemonTipoRoutes);
app.use('/api/pokemon-movimiento', pokemonMovimientoRoutes);
app.use('/api/pokemon-habilidad', pokemonHabilidadRoutes);
app.use('/api/pok-mov', pokMovRoutes);
app.use('/api/naturalezas', naturalezaRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/ivs', ivsRoutes);
app.use('/api/habilidades', habilidadRoutes);
app.use('/api/evs', evsRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/equipo-pokemon', equipoPokemonRoutes);
app.use('/api/detalles', detalleRoutes);
app.use('/api/articulos', articuloRoutes);
app.use('/api/cat', catRoutes);


// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API pokesito :)',
    version: '1.0.0'
  });
});
module.exports = app;