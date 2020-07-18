const router = require('express').Router()
const USER = require('../models/user')
const {checkEmail, checkParams, checkPassword} = require('../utils/valid')
const {createToken} = require('../utils/servicetoken')
const auth = require('../utils/auth')
const bcrypt = require('bcrypt')

router.get('/user', auth ,async (req,res)=>{
    var params  = req.query
    var limit = 100
    if(params.limit != null) limit = parseInt(params.limit)
    var order = -1
    if(params.order != null){
        if(params.order == 'desc') order = -1
        else if(params.order == 'asc')  order = 1
    }
    var skip = 10
    if(params.skip != null) skip = parseInt(params.skip)
    const users  = await USER.find({}).limit(limit).sort({_id: order}).skip(skip)
    res.status(200).json(users)
})

router.post('/user', async (req,res)=>{
    var params = req.body
    const errors = []
    if(checkParams("", params.name)) errors.push({error: 'es necesario un nombre'})
    if(checkParams("", params.email)) errors.push({error: 'es necesario un email'})
    if(checkParams("", params.password)) errors.push({error: 'es necesario un password'})
    if(checkParams("", params.sex)) errors.push({error: 'es necesario definir un sexo'})
    if(!checkParams("male", params.sex) && !checkParams("female", params.sex)) errors.push({error: 'el sexo solo puede ser masculino o femenino'})
    if(checkParams("", params.address)) errors.push({error: 'es necesario una direccion'})
    if(checkPassword(params.password) == '1') errors.push({error: 'el password debe tener al menos 6 caracteres'})
    if(checkPassword(params.password) == '2') errors.push({error: 'el password debe tener al menos un numero'})
    if(checkPassword(params.password) == '3') errors.push({error: 'el password debe tener al menos una letra'})
    if(checkPassword(params.password) == '4') errors.push({error: 'el password debe comenzar con una mayuscula'})
    if(!checkEmail(params.email)) errors.push({error: 'el correo no es valido (solo se permiten dominios hotmail, gmail, yahoo)'})
    if(errors.length>0) return res.send(errors)
    else{
        const us = await USER.findOne({email: params.email})
        if(us) return res.send('este email ya esta en uso')   
        const users = new USER(params)
        users.password = await checkPassword(users.password)
        await users.save()
        const token = createToken(users.id)
        res.status(200).json({msg:'se ha registrado', data: users, token, note: 'para entrar a las rutas protegidas usar, en el campo key de headers, x-access-token PD:queria probar si daba con otros textos ing. ggg'})
    }
})

router.post('/user/login', async (req,res)=>{
    const {email, password} = req.body
    const usr = await USER.findOne({email})
    console.log(usr)
    if(usr){
        //console.log(password, usr.password)
        if(await bcrypt.compare(password, usr.password)){
            const token  = createToken(usr.id)
            res.status(200).json({msg: 'estas loguedo', token, note: 'para entrar a las rutas protegidas usar, en el campo key de headers, x-access-token PD:queria probar si daba con otros textos ing. ggg'})
        }
        else return res.status(501).send('el password es incorrecto')
    }
    else return res.status(501).send('el email no esta registrado en nuestro servidor')
})

router.patch('/user', auth, async (req,res)=>{
    var params = req.body
    const errors = []
    if(checkParams("", params.name)) errors.push({error: 'es necesario un nombre'})
    if(checkParams("", params.email)) errors.push({error: 'es necesario un email'})
    if(checkParams("", params.password)) errors.push({error: 'es necesario un password'})
    if(checkParams("", params.address)) errors.push({error: 'es necesario una direccion'})
    if(checkPassword(params.password) == '1') errors.push({error: 'el password debe tener al menos 6 caracteres'})
    if(checkPassword(params.password) == '2') errors.push({error: 'el password debe tener al menos un numero'})
    if(checkPassword(params.password) == '3') errors.push({error: 'el password debe tener al menos una letra'})
    if(checkPassword(params.password) == '4') errors.push({error: 'el password debe comenzar con una mayuscula'})
    if(!checkEmail(params.email)) errors.push({error: 'el correo no es valido (solo se permiten dominios hotmail, gmail, yahoo)'})
    if(errors.length>0) return res.send(errors)
    else{
        const us = await USER.findOne({email: params.email})
        if(us) return res.send('este email ya esta en uso')
        if(req.query.id == null) return res.status(300).json({msn: "Erro no existe id"})
        var id = req.query.id
        await USER.findByIdAndUpdate(id, params)
        res.status(200).json(await USER.findById(id))
    }
   
})

router.delete('/user', auth, async(req,res)=>{
    if(req.query.id == null) return res.status(300).json({msn: "Erro no existe id"})
    var r = await USER.findByIdAndDelete(req.query.id)
    res.status(300).json(r)
})


module.exports = router