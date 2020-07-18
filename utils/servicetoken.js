const jwt  = require('jsonwebtoken')
const moment  = require('moment')
const config = require('./config')
const ctrl  = {}

ctrl.createToken = id=>{
    const params = {
        id: id,
        iat: moment().unix(),
        exp: moment().add(2, 'hour').unix()
    }
    return jwt.sign(params, config.secret)
}

module.exports = ctrl