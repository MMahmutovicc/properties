const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes){
    const Ponuda = sequelize.define('Ponuda', {
        tekst: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cijenaPonude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        datumPonude: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        odbijenaPonuda: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        korijenskiId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    },
    {
        freezeTableName: true,
        getterMethods: {
            async vezanePonude() {
                let result = [];
                let ponude = [];
                let korijenskaPonuda = null;
                if (this.korijenskiId === null) {
                    ponude = await Ponuda.findAll({ where: { korijenskiId: this.id } });
                }

                else {
                    ponude = await Ponuda.findAll({ 
                        where: { 
                            korijenskiId: this.korijenskiId,
                            id: { [Sequelize.Op.ne]: this.id }
                        } 
                    });

                    korijenskaPonuda = await Ponuda.findOne({ where: { id: this.korijenskiId } });
                }

                if (ponude && ponude.length > 0) {
                    result.push(...ponude);
                }
                
                if (korijenskaPonuda) {
                    result.unshift(korijenskaPonuda);
                }

                return result;
            }
        }
    })
    return Ponuda;
};