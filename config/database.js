var mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost/javascriptContactList')
    .then(()=> console.log('MongoDB connection successful'))
    .catch((err) => console.error(err))