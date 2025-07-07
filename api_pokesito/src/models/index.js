const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/db.config');

// Importar todos los modelos
const Usuario = require('./Usuario')(sequelize);
const Pokemon = require('./Pokemon')(sequelize);
const Tipo = require('./Tipo')(sequelize);
const Habilidad = require('./Habilidad')(sequelize);
const Naturaleza = require('./Naturaleza')(sequelize);
const Evs = require('./Evs')(sequelize);
const Ivs = require('./Ivs')(sequelize);
const Estadisticas = require('./Estadisticas')(sequelize);
const Detalle = require('./Detalle')(sequelize);
const Articulo = require('./Articulo')(sequelize);
const Cat = require('./Cat.js')(sequelize);
const Movimiento = require('./Movimiento')(sequelize);
const Equipo = require('./Equipo')(sequelize);
const Equipo_Pokemon = require('./Equipo_Pokemon')(sequelize);
const Pokemon_Habilidad = require('./Pokemon_Habilidad')(sequelize);
const Pokemon_Tipo = require('./Pokemon_Tipo')(sequelize);
const Pok_Mov = require('./Pok_Mov')(sequelize);
const Pokemon_Movimiento = require('./Pokemon_Movimiento')(sequelize);

// Establecer las relaciones

// Usuario -> Equipo (uno a muchos)
Usuario.hasMany(Equipo, { foreignKey: 'id_usuario' });
Equipo.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// Equipo -> Equipo_Pokemon (uno a muchos)
Equipo.hasMany(Equipo_Pokemon, { foreignKey: 'id_equipo' });
Equipo_Pokemon.belongsTo(Equipo, { foreignKey: 'id_equipo' });

// Pokemon -> Equipo_Pokemon (uno a muchos)
Pokemon.hasMany(Equipo_Pokemon, { foreignKey: 'id_pokemon' });
Equipo_Pokemon.belongsTo(Pokemon, { foreignKey: 'id_pokemon' });

// Detalle -> Equipo_Pokemon (uno a muchos)
Detalle.hasMany(Equipo_Pokemon, { foreignKey: 'id_detalle' });
Equipo_Pokemon.belongsTo(Detalle, { foreignKey: 'id_detalle' });

// Articulo -> Equipo_Pokemon (uno a muchos)
Articulo.hasMany(Equipo_Pokemon, { foreignKey: 'id_articulo' });
Equipo_Pokemon.belongsTo(Articulo, { foreignKey: 'id_articulo' });

// Estadisticas -> Equipo_Pokemon (uno a muchos)
Estadisticas.hasMany(Equipo_Pokemon, { foreignKey: 'id_estadisticas' });
Equipo_Pokemon.belongsTo(Estadisticas, { foreignKey: 'id_estadisticas' });

// Habilidad -> Equipo_Pokemon (uno a muchos)
Habilidad.hasMany(Equipo_Pokemon, { foreignKey: 'id_habilidad' });
Equipo_Pokemon.belongsTo(Habilidad, { foreignKey: 'id_habilidad' });

// Evs -> Estadisticas (uno a muchos)
Evs.hasMany(Estadisticas, { foreignKey: 'id_evs' });
Estadisticas.belongsTo(Evs, { foreignKey: 'id_evs' });

// Ivs -> Estadisticas (uno a muchos)
Ivs.hasMany(Estadisticas, { foreignKey: 'id_ivs' });
Estadisticas.belongsTo(Ivs, { foreignKey: 'id_ivs' });

// Naturaleza -> Estadisticas (uno a muchos)
Naturaleza.hasMany(Estadisticas, { foreignKey: 'id_naturaleza' });
Estadisticas.belongsTo(Naturaleza, { foreignKey: 'id_naturaleza' });

// Tipo -> Detalle (uno a muchos) - Para tipo tera
Tipo.hasMany(Detalle, { foreignKey: 'Tipo_tera', as: 'DetallesTera' });
Detalle.belongsTo(Tipo, { foreignKey: 'Tipo_tera', as: 'TipoTera' });

// Tipo -> Movimiento (uno a muchos)
Tipo.hasMany(Movimiento, { foreignKey: 'id_tipo' });
Movimiento.belongsTo(Tipo, { foreignKey: 'id_tipo' });

// Cat -> Movimiento (uno a muchos)
Cat.hasMany(Movimiento, { foreignKey: 'id_cat' });
Movimiento.belongsTo(Cat, { foreignKey: 'id_cat' });

// Relaciones muchos a muchos

// Pokemon <-> Habilidad (muchos a muchos a través de Pokemon_Habilidad)
Pokemon.belongsToMany(Habilidad, { 
    through: Pokemon_Habilidad, 
    foreignKey: 'id_pokemon',
    otherKey: 'id_habilidad'
});
Habilidad.belongsToMany(Pokemon, { 
    through: Pokemon_Habilidad, 
    foreignKey: 'id_habilidad',
    otherKey: 'id_pokemon'
});

// Pokemon <-> Tipo (muchos a muchos a través de Pokemon_Tipo)
Pokemon.belongsToMany(Tipo, { 
    through: Pokemon_Tipo, 
    foreignKey: 'id_pokemon',
    otherKey: 'id_tipo'
});
Tipo.belongsToMany(Pokemon, { 
    through: Pokemon_Tipo, 
    foreignKey: 'id_tipo',
    otherKey: 'id_pokemon'
});

// Equipo_Pokemon <-> Movimiento (muchos a muchos a través de Pok_Mov)
Equipo_Pokemon.belongsToMany(Movimiento, { 
    through: Pok_Mov, 
    foreignKey: 'id_equipo_pokemon',
    otherKey: 'id_movimiento'
});
Movimiento.belongsToMany(Equipo_Pokemon, { 
    through: Pok_Mov, 
    foreignKey: 'id_movimiento',
    otherKey: 'id_equipo_pokemon'
});
//Pookemon <-> Movimiento (muchos a muchos a través de Pokemon_Movimiento)
Pokemon.belongsToMany(Movimiento, { 
    through: Pokemon_Movimiento, 
    foreignKey: 'id_pokemon',
    otherKey: 'id_movimiento'
});
Movimiento.belongsToMany(Pokemon, { 
    through: Pokemon_Movimiento,    
    foreignKey: 'id_movimiento',
    otherKey: 'id_pokemon'
});

// Relaciones directas para las tablas intermedias
Pokemon_Habilidad.belongsTo(Pokemon, { foreignKey: 'id_pokemon' });
Pokemon_Habilidad.belongsTo(Habilidad, { foreignKey: 'id_habilidad' });

Pokemon_Tipo.belongsTo(Pokemon, { foreignKey: 'id_pokemon' });
Pokemon_Tipo.belongsTo(Tipo, { foreignKey: 'id_tipo' });

Pok_Mov.belongsTo(Equipo_Pokemon, { foreignKey: 'id_equipo_pokemon' });
Pok_Mov.belongsTo(Movimiento, { foreignKey: 'id_movimiento' });

// Relaciones directas para tablas de unión (para includes)
Pokemon_Tipo.belongsTo(Pokemon, { foreignKey: 'id_pokemon' });
Pokemon_Tipo.belongsTo(Tipo, { foreignKey: 'id_tipo' });

module.exports = {
    Usuario,
    Pokemon,
    Tipo,
    Habilidad,
    Naturaleza,
    Evs,
    Ivs,
    Estadisticas,
    Detalle,
    Articulo,
    Cat,
    Movimiento,
    Equipo,
    Equipo_Pokemon,
    Pokemon_Habilidad,
    Pokemon_Tipo,
    Pok_Mov,
    Pokemon_Movimiento,
    Sequelize: sequelize.Sequelize,
    sequelize
};