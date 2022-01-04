var mongoose = require('mongoose')
mongoose.Promise = global.Promise

require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(()=> console.log('MongoDB connection successful'))
    .catch((err) => console.error(err))