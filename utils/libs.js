function random () {
    const posib = 'abcddefghijklmnopqrstuvwxyz0123456789'
    var result = ''
    for(var i =0; i<=7; i++){
        result += posib.charAt(Math.floor(Math.random() * posib.length) ) 
    }
    return result
}

module.exports = random