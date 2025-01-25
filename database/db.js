const Sequelize = require("sequelize");
const sequelize_obj = new Sequelize("wt24","root","",{host:"localhost",dialect:"mysql"});
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
db.nekretnina.hasMany(db.upit, { foreignKey: 'nekretninaId' });
db.nekretnina.hasMany(db.zahtjev, { foreignKey: 'nekretninaId' });
db.nekretnina.hasMany(db.ponuda, { foreignKey: 'nekretninaId' });

db.upit.belongsTo(db.nekretnina, { foreignKey: 'nekretninaId' });
db.zahtjev.belongsTo(db.nekretnina, { foreignKey: 'nekretninaId' });
db.ponuda.belongsTo(db.nekretnina, { foreignKey: 'nekretninaId' });

// Relacije Korisnik - Interesovanja
db.korisnik.hasMany(db.upit, { foreignKey: 'korisnikId' });
db.korisnik.hasMany(db.zahtjev, { foreignKey: 'korisnikId' });
db.korisnik.hasMany(db.ponuda, { foreignKey: 'korisnikId' });

db.upit.belongsTo(db.korisnik, { foreignKey: 'korisnikId' });
db.zahtjev.belongsTo(db.korisnik, { foreignKey: 'korisnikId' });
db.ponuda.belongsTo(db.korisnik, { foreignKey: 'korisnikId' });

// Ponuda ima vezane ponude
db.ponuda.hasMany(db.ponuda, { as: 'vezanePonude', foreignKey: 'parent_offerId' });
db.ponuda.belongsTo(db.ponuda, { as: 'parentOffer', foreignKey: 'parent_offerId' });

module.exports=db;

// (async () => {
//     try {
//       await sequelize_obj.authenticate();
//       console.log('Konekcija na bazu je uspešna!');
  
//       // Kreiranje tabela
//       await sequelize_obj.sync({ force: true });
//       console.log('Tabele su kreirane!');
//     } catch (error) {
//       console.error('Greška pri konekciji:', error);
//     }
// })();

db.nekretnina.getInteresovanja = async function (nekretninaId) {
  const nekretnina = await db.nekretnina.findByPk(nekretninaId);
  if (!nekretnina) {
    throw new Error('Nekretnina not found');
  }
  const upiti = await db.upit.findAll({ where: { nekretninaId: nekretninaId } });
  const zahtjevi = await db.zahtjev.findAll({ where: { nekretninaId: nekretninaId } });
  const ponude = await db.ponuda.findAll({ where: { nekretninaId: nekretninaId } });
  return { upiti, zahtjevi, ponude };
};