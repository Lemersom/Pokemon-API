const {DataTypes, Op} = require('sequelize')
const sequelize = require('../helpers/database')


const TrainerModel = sequelize.define("Trainers",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING
    }, {timestamps: false}
)

module.exports = {
    list: async function(limit, offset){
        const trainers = await TrainerModel.findAll({
            limit: limit,
            offset: offset
        })
        return trainers
    },

    save: async function(name){
        const trainer = await TrainerModel.create({name:name})
        return trainer
    },

    update: async function(id, name){
        return await TrainerModel.update({name: name}, {
            where: {id: id}
        })
    },

    delete: async function(id){
        return await TrainerModel.destroy({where: {id: id}})
    },

    getById: async function(id){
        return await TrainerModel.findByPk(id)
    },
    
    getByName: async function(name){
        return await TrainerModel.findOne({where: {name: {
            [Op.like]: '%' + name + '%'
        }}})
    },

    duel: async function(trainer1, trainer2){
        const Pokemon = require('./Pokemon')
        let pokesQty = await Pokemon.Model.count()
        
        let pokes1 = []
        let pokes2 = []
        for(let i = 1; i <= pokesQty; i++){
            let poke = await Pokemon.getById(i)
            if(poke){
                if(poke.trainer == trainer1.id){
                    pokes1.push(poke.type)
                }
                else if(poke.trainer == trainer2.id){
                    pokes2.push(poke.type)
                }
            }
            else{
                pokesQty++ //pokemon deleted
            }
        }

        //remove duplicates
        let uniqueTypes1 = [...new Set(pokes1)]
        let uniqueTypes2 = [...new Set(pokes2)]

        let fault1 = pokes1.length - uniqueTypes1.length
        let fault2 = pokes2.length - uniqueTypes2.length

        let points1 = fault2 + pokes1.length
        let points2 = fault1 + pokes2.length

        for(let i = 0; i < pokes2.length; i++){
            for(let j = 0; j < pokes1.length; j++){
                if(pokes1[j] == 'Fire' && pokes2[i] == 'Grass'){
                    points1++
                }
                else if(pokes1[j] == 'Water' && pokes2[i] == 'Fire'){
                    points1++
                }
                else if(pokes1[j] == 'Grass' && pokes2[i] == 'Water'){
                    points1++
                }
            }
        }

        for(let i = 0; i < pokes1.length; i++){
            for(let j = 0; j < pokes2.length; j++){
                if(pokes2[j] == 'Fire' && pokes1[i] == 'Grass'){
                    points2++
                }
                else if(pokes2[j] == 'Water' && pokes1[i] == 'Fire'){
                    points2++
                }
                else if(pokes2[j] == 'Grass' && pokes1[i] == 'Water'){
                    points2++
                }
            }
        }
        
        if(points1 == points2){
            return "draw"
        }
        else if(points1 > points2){
            return trainer1
        }
        else if(points2 > points1){
            return trainer2
        }
    },

    Model: TrainerModel
}