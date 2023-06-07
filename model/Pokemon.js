const {DataTypes, Op} = require('sequelize')
const sequelize = require('../helpers/database')
const Trainer = require('./Trainer')

const PokemonModel = sequelize.define('Pokemons', 
    {
        name: DataTypes.STRING,
        type: DataTypes.STRING
    }
)

PokemonModel.belongsTo(Trainer.Model, {
    foreignKey: 'trainer'
})
Trainer.Model.hasMany(PokemonModel, {foreignKey: 'trainer'})

module.exports = {
    list: async function(){
        const pokemons = await PokemonModel.findAll({include: Trainer.Model})
        return pokemons
    },

    save: async function(name, type, trainer){
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

        const pokemon = await PokemonModel.create({
            name: name,
            type: type,
            trainer: trainer
        })
        return pokemon
    },

    update: async function(id, obj){
        let pokemon = await PokemonModel.findByPk(id)
        if(!pokemon){
            return false
        }

        Object.keys(obj.forEach(key => pokemon[key] = obj[key]))
        await pokemon.save()
        return pokemon
    },

    delete: async function(id){
        const pokemon = await PokemonModel.findByPk(id)
        return pokemon.destroy()
    },

    getById: async function(id){
        return await PokemonModel.findByPk(id)
    },

    Model: PokemonModel
}