const jwt  = require('jsonwebtoken')
const config  = require('./config')

function auth (req, res, next){
    const token = req.headers['x-access-token']
    if(!token) return res.status(401).json({message: 'falta un token'})
    try{
        const decod = jwt.verify(token, config.secret)
        if(decod){
            req.userId = decod.id
            next()
        }
        else return res.send('token invalido')
    }catch(err){
        return res.send(`el token expiro ${err.name}`)
    }
}

module.exports = auth