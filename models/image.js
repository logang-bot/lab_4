const mongoose = require('mongoose')
const {Schema} = mongoose

const imgSchema = new Schema({
    path: String,
    relativepath: String,
    idUser: String,
    filename: String,
    timestamp: {type: Date, default: Date.now},
    active: {type: Number, default: 1}
})

module.exports = mongoose.model('img', imgSchema)