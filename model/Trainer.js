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

    Model: TrainerModel
}