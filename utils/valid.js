const bcrypt = require('bcrypt')

const valid = {
    checkParams: function(refobj, evalueobj){
        console.log(refobj, evalueobj)
        if(refobj!=evalueobj) return false
        return true
    },
    checkPassword: async function(password){
        if(password.length < 6) return '1'
        else if(!/[0-9]+/.test(password)) return '2'
        else if(!/[A-z]+/.test(password)) return '3'
        else if(!/^([A-Z])+/.test(password)) return '4'
        const salt = await bcrypt.genSalt(10)
        const hash = bcrypt.hash(password, salt)
        return hash
    }, 
    checkEmail: function(email){
        if(!/\w+\@\w+\.\w{2,3}/.test(email)) return false
        return true
    } 
}

module.exports = valid