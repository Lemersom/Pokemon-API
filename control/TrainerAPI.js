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

module.exports = router