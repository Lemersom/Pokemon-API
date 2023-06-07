const express = require('express')
const router = express.Router()
const sequelize = require('../helpers/database')

const TrainerModel = require('../model/Trainer')
const PokemonModel = require('../model/Pokemon')
const PokeballModel = require('../model/Pokeball')

router.get('/', async (req, res) => {
    await sequelize.sync({force: true})

    //Trainers
    let trainers = [
        "Red", "Ethan", "Brendan", "Lucas", "Hilbert"
    ]
    let listTrainers = []
    for(let i = 0; i < trainers.length; i++){
        listTrainers.push(await TrainerModel.save(trainers[i]))
    }

    //Pokemons
    let pokemon1 = await PokemonModel.save("Pikachu", "Electric", listTrainers[0].id)
    let pokemon2 = await PokemonModel.save("Totodile", "Water", listTrainers[1].id)
    let pokemon3 = await PokemonModel.save("Treecko", "Grass", listTrainers[2].id)
    let pokemon4 = await PokemonModel.save("Chimchar", "Fire", listTrainers[3].id)
    let pokemon5 = await PokemonModel.save("Snivy", "Grass", listTrainers[4].id)

    listPokemons = [pokemon1, pokemon2, pokemon3, pokemon4, pokemon5]

    //Pokeballs
    let pokeball1 = await PokeballModel.save("Poke Ball", 10, listTrainers[0].id)
    let pokeball2 = await PokeballModel.save("Great Ball", 5, listTrainers[1].id)
    let pokeball3 = await PokeballModel.save("Quick Ball", 8, listTrainers[2].id)
    let pokeball4 = await PokeballModel.save("Ultra Ball", 3, listTrainers[3].id)
    let pokeball5 = await PokeballModel.save("Master Ball", 1, listTrainers[4].id)

    listPokeballs = [pokeball1, pokeball2, pokeball3, pokeball4, pokeball5]

    res.json({status:true, trainers: listTrainers, pokemons: listPokemons, pokeballs: listPokeballs})
})

module.exports = router