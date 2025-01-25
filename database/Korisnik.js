const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes){
    const Korisnik = sequelize.define("Korisnik",{
        ime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prezime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        freezeTableName: true
    })
    return Korisnik;
};