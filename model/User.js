const {DataTypes, Op} = require('sequelize')
const sequelize = require('../helpers/database')

const UserModel = sequelize.define("Users",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,

        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }
)

module.exports = {
    list: async function(){
        const users = await UserModel.findAll()
        return users
    },

    save: async function(name, email, username, password, admin){
        const user = await UserModel.create({name: name, email: email, username: username, password: password, admin: admin})
        return user
    },

    update: async function(id, name, email, admin){
        return await UserModel.update({name: name, email: email, admin: admin}, {
            where: {id: id}
        })
    },

    delete: async function(id){
        return await UserModel.destroy({where: {id: id}})
    },

    getById: async function(id){
        return await UserModel.findByPk(id)
    },

    getByUsername: async function(username){
        return await UserModel.findOne({where: {username: {
            [Op.like]: '%' + username + '%'
        }}})
    },

    Model: UserModel
}