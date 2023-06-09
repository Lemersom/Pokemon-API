const express = require('express')
const router = express.Router()

const PokemonModel = require('../model/Pokemon')

router.get('/', async (req, res) => {
    let pokemons = await PokemonModel.list()
    res.json({status: true, list:pokemons})
})

router.get('/:id', async (req, res) => {
    let obj = await PokemonModel.getById(req.params.id)
    if(obj){
        res.json({status: true, pokemon:obj})
    }
    else{
        res.status(500).json({status: false, msg: 'Pokemon not found'})
    }
})

router.post('/', async (req, res) => {
    const {name, type, trainer} = req.body

    let obj = await PokemonModel.save(name, type, trainer)
    if(obj){
        res.json({status: true, pokemon: obj})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to SAVE new Pokemon'})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {name, type, trainer} = req.body

    let [result] = await PokemonModel.update(id, name, type, trainer)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: "ERROR: Failed to UPDATE the Pokemon"})
    }
})

router.delete('/:id', async (req, res) => {
    let result = await PokemonModel.delete(req.params.id)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to DELETE the Pokemon'})
    }
})

module.exports = router