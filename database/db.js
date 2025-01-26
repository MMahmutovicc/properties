const Sequelize = require("sequelize");
//TODO: promijeniti password
const sequelize_obj = new Sequelize("wt24","root","password",{host:"localhost",dialect:"mysql"});
const db={};
const path = require('path');

db.Sequelize = Sequelize;  
db.sequelize = sequelize_obj;

//import modela
db.korisnik = require(path.join(__dirname, '/Korisnik.js'))(sequelize_obj, Sequelize.DataTypes);
db.nekretnina = require(path.join(__dirname, '/Nekretnina.js'))(sequelize_obj, Sequelize.DataTypes);
db.ponuda = require(path.join(__dirname, '/Ponuda.js'))(sequelize_obj, Sequelize.DataTypes);
db.upit = require(path.join(__dirname, '/Upit.js'))(sequelize_obj, Sequelize.DataTypes);
db.zahtjev = require(path.join(__dirname, '/Zahtjev.js'))(sequelize_obj, Sequelize.DataTypes);

//relacije
// Relacije Nekretnina - Interesovanja
db.nekretnina.hasMany(db.upit, { foreignKey: 'nekretninaId', onDelete: 'CASCADE', as: 'upiti' });
db.nekretnina.hasMany(db.zahtjev, { foreignKey: 'nekretninaId', onDelete: 'CASCADE', as: 'zahtjevi' });
db.nekretnina.hasMany(db.ponuda, { foreignKey: 'nekretninaId', onDelete: 'CASCADE', as: 'ponude' });

db.upit.belongsTo(db.nekretnina, { foreignKey: 'nekretninaId', as: 'nekretnina' });
db.zahtjev.belongsTo(db.nekretnina, { foreignKey: 'nekretninaId', as: 'nekretnina' });
db.ponuda.belongsTo(db.nekretnina, { foreignKey: 'nekretninaId', as: 'nekretnina' });

// Relacije Korisnik - Interesovanja
db.korisnik.hasMany(db.upit, { foreignKey: 'korisnikId', onDelete: 'CASCADE', as: 'upiti' });
db.korisnik.hasMany(db.zahtjev, { foreignKey: 'korisnikId', onDelete: 'CASCADE', as: 'zahtjevi' });
db.korisnik.hasMany(db.ponuda, { foreignKey: 'korisnikId', onDelete: 'CASCADE', as: 'ponude' });

db.upit.belongsTo(db.korisnik, { foreignKey: 'korisnikId', as: 'korisnik' });
db.zahtjev.belongsTo(db.korisnik, { foreignKey: 'korisnikId', as: 'korisnik' });
db.ponuda.belongsTo(db.korisnik, { foreignKey: 'korisnikId', as: 'korisnik' });

// Ponuda ima vezane ponude
db.ponuda.hasMany(db.ponuda, { foreignKey: 'korijenskiId', as: 'ponude' });
db.ponuda.belongsTo(db.ponuda, { as: 'korijenskaPonuda', foreignKey: 'korijenskiId' });

module.exports=db;

db.nekretnina.getInteresovanja = async function (nekretninaId) {
  const nekretnina = await db.nekretnina.findByPk(nekretninaId, {
    include: [
      { model: db.upit, as: 'upiti' },
      { model: db.zahtjev, as: 'zahtjevi' },
      { model: db.ponuda, as: 'ponude' }
    ]
  });
  if (!nekretnina) {
    throw new Error('Nekretnina nije pronadjena');
  }
  
  return [ ...nekretnina.upiti, ...nekretnina.zahtjevi, ...nekretnina.ponude ];
};