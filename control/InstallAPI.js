const express = require('express')
const router = express.Router()
const sequelize = require('../helpers/database')

const jwt = require('jsonwebtoken')

const TrainerModel = require('../model/Trainer')
const PokemonModel = require('../model/Pokemon')
const PokeballModel = require('../model/Pokeball')
const UserModel = require('../model/User')

function createSuperUser(){
    const username = 'SuperUser'
    const password = 'SuperUser'
    
    let token = jwt.sign({username: username}, '#Abcasdfqwr', {
        expiresIn: '30 min'
    })

    return {username, password, token}
}

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})

    //User
    const obj = createSuperUser()
    const superUser = await UserModel.save('SuperUser', null, obj.username, obj.password, true, obj.token)

    
    //Trainers
    let trainers = [
        "Red", "Ethan", "Brendan", "Lucas", "Hilbert"
    ]
    let listTrainers = []
    for(let i = 0; i < trainers.length; i++){
        listTrainers.push(await TrainerModel.save(trainers[i]))
    }


    //Pokemons
    listPokemons = [
        await PokemonModel.save("Bulbasaur", "Grass", listTrainers[0].id),
        await PokemonModel.save("Charmander", "Fire", listTrainers[0].id),
        await PokemonModel.save("Squirtle", "Water", listTrainers[0].id),

        await PokemonModel.save("Chikorita", "Grass", listTrainers[1].id),
        await PokemonModel.save("Cyndaquil", "Fire", listTrainers[1].id),
        await PokemonModel.save("Totodile", "Water", listTrainers[1].id),

        await PokemonModel.save("Mudkip", "Water", listTrainers[2].id),
        await PokemonModel.save("Corphish", "Water", listTrainers[2].id),
        await PokemonModel.save("Feebas", "Water", listTrainers[2].id),

        await PokemonModel.save("Chimchar", "Fire", listTrainers[3].id),
        await PokemonModel.save("Turtwig", "Grass", listTrainers[3].id),

        await PokemonModel.save("Tepig", "Fire", listTrainers[4].id)
    ]


    //Pokeballs
    listPokeballs = [
        await PokeballModel.save("Poke Ball", 10, listTrainers[0].id),
        await PokeballModel.save("Great Ball", 5, listTrainers[1].id),
        await PokeballModel.save("Quick Ball", 8, listTrainers[2].id),
        await PokeballModel.save("Ultra Ball", 3, listTrainers[3].id),
        await PokeballModel.save("Master Ball", 1, listTrainers[4].id),
    ]


    res.json({status:true, superUser: superUser, trainers: listTrainers, pokemons: listPokemons, pokeballs: listPokeballs})
})

module.exports = router