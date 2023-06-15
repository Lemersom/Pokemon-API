const {DataTypes, Op} = require('sequelize')
const sequelize = require('../helpers/database')
const Trainer = require('./Trainer')

const PokeballModel = sequelize.define('Pokeballs', 
    {
        name: DataTypes.STRING,
        qty: DataTypes.INTEGER //quantity
    }, {timestamps: false}
)

PokeballModel.belongsTo(Trainer.Model, {
    foreignKey: 'trainer'
})
Trainer.Model.hasMany(PokeballModel, {foreignKey: 'trainer'})

module.exports = {
    list: async function(){
        const pokeballs = await PokeballModel.findAll({include: Trainer.Model})
        return pokeballs
    },

    save: async function(name, qty, trainer){
        if(trainer instanceof Trainer.Model){
            trainer = trainer.id
        }
        else if(typeof trainer === 'string'){
            obj = await Trainer.getByName(trainer)
            console.log(obj)
            if(!obj){
                return null
            }
            trainer = obj.id
        }

        const pokeball = await PokeballModel.create({
            name: name,
            qty: qty,
            trainer: trainer
        })
        return pokeball
    },

    update: async function(id, name, qty, trainer){
        return await PokeballModel.update({name: name, qty: qty, trainer: trainer}, {
            where: {id: id}
        })
    },

    delete: async function(id){
        const pokeball = await PokeballModel.findByPk(id)
        if(pokeball){
            return pokeball.destroy()
        }
        else{
            return false
        } 
    },

    getById: async function(id){
        return await PokeballModel.findByPk(id)
    },

    Model: PokeballModel
}