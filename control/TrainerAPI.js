const express = require('express')
const router = express.Router()

const TrainerModel = require('../model/Trainer')

router.get('/', async (req, res) => {
    //Query params exemple: ?limit=5&page=2
    let limit = req.query.limit
    let page = req.query.page

    if(!limit){
        limit = await TrainerModel.Model.count()
    }
    if(!page){
        page = 1
    }

    let offset = (limit * page) - limit

    let trainers = await TrainerModel.list(limit, offset)
    res.json({status: true, list:trainers})
})

router.get('/:id', async (req, res) => {
    let obj = await TrainerModel.getById(req.params.id)
    if(obj){
        res.json({status: true, trainer:obj})
    }
    else{
        res.status(500).json({status: false, msg: 'Trainer not found'})
    }
})

router.post('/', async (req, res) => {
    const {name} = req.body

    let obj = await TrainerModel.save(name)
    if(obj){
        res.json({status: true, trainer: obj})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to SAVE new Trainer'})
    }
})

router.put('/:id', async (req, res) => {
    const {id} = req.params
    const {name} = req.body

    let [result] = await TrainerModel.update(id, name)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: "ERROR: Failed to UPDATE the Trainer"})
    }
})

router.delete('/:id', async (req, res) => {
    let result = await TrainerModel.delete(req.params.id)
    if(result){
        res.json({status: true, result: result})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to DELETE the Trainer'})
    }
})

router.post('/duel', async (req, res) => {
    const trainer1 = await TrainerModel.getById(req.body.trainer1)
    const trainer2 = await TrainerModel.getById(req.body.trainer2)

    if(!trainer1 || !trainer2){
        res.status(500).json({status: false, msg: 'ERROR: Trainers not found'})
    }
    else if(trainer1 == trainer2){
        res.status(500).json({status: false, msg: 'ERROR: Trainer cannot duel with himself'})
    }
    else{
        let duel = await TrainerModel.duel(trainer1, trainer2)
        if(duel == "draw"){
            res.json({status: true, msg: "Both teams have the same efficiency"})
        }
        else if(duel == trainer1){
            res.json({status: true, msg: "Trainer1's team is more efficient"})
        }
        else if(duel == trainer2){
            res.json({status: true, msg: "Trainer2's team is more efficient"})
        }
        else{
            res.status(500).json({status: false, msg: 'ERROR: Duel error'})
        }
    }
})

module.exports = router