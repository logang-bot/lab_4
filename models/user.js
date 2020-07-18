const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema  = new Schema({
    name: String,
    email: String,
    password: String,
    registerdate: Date,
    sex: String,
    address: String,
    avatar: {type: String, default:''}
})

module.exports = mongoose.model('user', userSchema)