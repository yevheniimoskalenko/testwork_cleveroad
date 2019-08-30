const express = require('express');
const mysql = require('mysql')
const bodyParser = require('body-parser');


const app = express();

app.get('/', (req, res) => {
    return res.send('good')
})

app.listen('3000', () => console.log('Server is run, port: 3000'))