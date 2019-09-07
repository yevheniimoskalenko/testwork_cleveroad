const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const upload = require('express-fileupload');
const app = express();
app.use(upload())


app.use('/api', require('./api'))


app.listen('3000', () => console.log('Server is run, port: 3000'))