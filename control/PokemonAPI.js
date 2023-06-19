const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const TrainerModel = require('../model/Trainer')
const PokemonModel = require('../model/Pokemon')


function validateToken(req, res, next){
    let token_full = req.headers['authorization']
    if(!token_full){
        token_full = ''
    }
    let token = token_full.split(': ')[1]
    jwt.verify(token, '#Abcasdfqwr', (error, payload) => {
        if(error){
            res.status(403).json({status: false, msg: 'Access denied - Invalid token', token: token})
            return
        }
        req.username = payload.username
        next()
    })
}

function checkType(type){
    if(type){
        if((type == 'Fire') || (type == 'Water') || (type == 'Grass')){
            return true
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}


router.get('/', async (req, res) => {
    //Query params exemple: ?limit=5&page=2
    let limit = req.query.limit
    let page = req.query.page

    if(!limit){
        limit = await PokemonModel.Model.count()
    }
    if(!page){
        page = 1
    }

    let offset = (limit * page) - limit

    let pokemons = await PokemonModel.list(limit, offset)
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

router.post('/', validateToken, async (req, res) => {
    const {name, type, trainer} = req.body

    if(! await TrainerModel.getById(trainer)){
        res.status(500).json({status: false, msg: 'ERROR: Trainer not found'})
    }
    else{
        if(!checkType(type)){
            res.status(500).json({status: false, msg: 'ERROR: Type must be Fire, Water or Grass'})
        }
        else{
            let obj = await PokemonModel.save(name, type, trainer)
            if(obj){
                res.json({status: true, pokemon: obj})
            }
            else{
                res.status(500).json({status: false, msg: 'ERROR: Failed to SAVE new Pokemon'})
            }
        }
    }
})

router.put('/:id', validateToken, async (req, res) => {
    const {id} = req.params
    const {name, type, trainer} = req.body

    if(! await TrainerModel.getById(trainer)){
        res.status(500).json({status: false, msg: 'ERROR: Trainer not found'})
    }
    else{
        if(!checkType(type)){
            res.status(500).json({status: false, msg: 'ERROR: Type must be Fire, Water or Grass'})
        }
        else{
            let [result] = await PokemonModel.update(id, name, type, trainer)
            if(result){
                res.json({status: true, result: result})
            }
            else{
                res.status(500).json({status: false, msg: "ERROR: Failed to UPDATE the Pokemon"})
            }
        }
    }
})

router.delete('/:id', validateToken, async (req, res) => {
    let result = await PokemonModel.delete(req.params.id)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to DELETE the Pokemon'})
    }
})

module.exports = router