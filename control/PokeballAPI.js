const express = require('express')
const router = express.Router()

const PokeballModel = require('../model/Pokeball')

router.get('/', async (req, res) => {
    let pokeballs = await PokeballModel.list()
    res.json({status: true, list:pokeballs})
})

router.get('/:id', async (req, res) => {
    let obj = await PokeballModel.getById(req.params.id)
    if(obj){
        res.json({status: true, pokeball:obj})
    }
    else{
        res.status(500).json({status: false, msg: 'Pokeball not found'})
    }
})

router.post('/', async (req, res) => {
    const {name, qty, trainer} = req.body

    let obj = await PokeballModel.save(name, qty, trainer)
    if(obj){
        res.json({status: true, pokeball: obj})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to SAVE new Pokeball'})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {name, qty, trainer} = req.body

    let [result] = await PokeballModel.update(id, name, qty, trainer)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        req.status(500).json({status: false, msg: 'ERROR: Failed to UPDATE the Pokemon'})
    }
})

router.delete('/:id', async (req, res) => {
    let result = await PokeballModel.delete(req.params.id)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to DELETE the Pokeball'})
    }
})

module.exports = router