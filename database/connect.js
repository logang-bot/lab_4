const mongoose = require('mongoose')

mongoose.connect('mongodb://172.29.0.2:27017/crud')
.then(db=>console.log('bd conectada'))
.catch(err=>console.error(err))
