var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')

// Database Setup
require('./config/database')

var usersRouter = require('./app/routes/users')
var contactsRouter = require('./app/routes/contacts')

var app = express()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/users', usersRouter)
app.use('/contacts', contactsRouter)

module.exports = app;
