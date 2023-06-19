const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const TrainerModel = require('../model/Trainer')
const PokeballModel = require('../model/Pokeball')


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


router.get('/', async (req, res) => {
    //Query params exemple: ?limit=5&page=2
    let limit = req.query.limit
    let page = req.query.page

    if(!limit){
        limit = await PokeballModel.Model.count()
    }
    if(!page){
        page = 1
    }

    let offset = (limit * page) - limit

    let pokeballs = await PokeballModel.list(limit, offset)
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

router.post('/', validateToken, async (req, res) => {
    const {name, qty, trainer} = req.body

    if(! await TrainerModel.getById(trainer)){
        res.status(500).json({status: false, msg: 'ERROR: Trainer not found'})
    }
    else{
        let obj = await PokeballModel.save(name, qty, trainer)
        if(obj){
            res.json({status: true, pokeball: obj})
        }
        else{
            res.status(500).json({status: false, msg: 'ERROR: Failed to SAVE new Pokeball'})
        }
    }
})

router.put('/:id', validateToken, async (req, res) => {
    const {id} = req.params
    const {name, qty, trainer} = req.body

    if(! await TrainerModel.getById(trainer)){
        res.status(500).json({status: false, msg: 'ERROR: Trainer not found'})
    }
    else{
        let [result] = await PokeballModel.update(id, name, qty, trainer)
        if(result){
            res.json({status: true, result: result})
        }
        else{
            req.status(500).json({status: false, msg: 'ERROR: Failed to UPDATE the Pokemon'})
        }
    }
})

router.delete('/:id', validateToken, async (req, res) => {
    let result = await PokeballModel.delete(req.params.id)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to DELETE the Pokeball'})
    }
})

module.exports = router