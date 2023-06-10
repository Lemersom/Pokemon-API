const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const UserModel = require('../model/User')


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


router.post('/register', async (req, res) => {
    const {name, email, username, password} = req.body

    let obj = await UserModel.save(name, email, username, password, false, null)
    if(obj){
        res.json({status: true, trainer: obj})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Failed to REGISTER'})
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    
    let obj = await UserModel.getByUsername(username)
    
    if(!obj){
        res.status(500).json({status: false, msg: 'ERROR: User not found'})
    }

    if(obj.password == password){
        let token = jwt.sign({username: username}, '#Abcasdfqwr', {
            expiresIn: '30 min'
        })
        UserModel.update(obj.id, obj.name, obj.email, obj.username, obj.password, obj.admin, token)
        res.json({status: true, token: token})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: Invalid Username/Password'})
    }
})

router.get('/', async (req, res) => {
    let users = await UserModel.list()
    res.json({status: true, list:users})
})

router.get('/:id', async (req, res) => {
    let obj = await UserModel.getById(req.params.id)
    if(obj){
        res.json({status: true, user:obj})
    }
    else{
        res.status(500).json({status: false, msg: 'ERROR: User not found'})
    }
})

//Admin creating new user/admin
router.post('/', validateToken, async (req, res) => {
    const {name, email, username, password, admin} = req.body
    
    let user = await UserModel.getByUsername(req.username)
    if(!user){
        res.status(500).json({status: false, msg: 'ERROR: User not found'})
    }

    if(!user.admin){
        res.status(500).json({status: false, msg: 'ERROR: User is not admin'})
    }
    else{
        let obj = await UserModel.save(name, email, username, password, admin)
        if(obj){
            res.json({status: true, user: obj})
        }
        else{
            res.status(500).json({status: false, msg: 'ERROR: Failed to SAVE new User'})
        }
    }
})

//Admin deleting non-admin user
router.delete('/:id', validateToken, async (req, res) => {
    let user = await UserModel.getByUsername(req.username)
    if(!user){
        res.status(500).json({status: false, msg: 'ERROR: User not found'})
    }

    if(!user.admin){
        res.status(500).json({status: false, msg: 'ERROR: User is not admin'})
    }
    else{
        let obj = await UserModel.getById(req.params.id)
        if(!obj){
            res.status(500).json({status: false, msg: 'ERROR: User not found to DELETE'})
        }
        else{
            let result = await UserModel.delete(req.params.id)
            if(result){
                res.json({status: true, result: result})
            }
            else{
                res.status(500).json({status: false, msg: 'ERROR: Failed to DELETE the User'})
            }
        }
    }
})

module.exports = router