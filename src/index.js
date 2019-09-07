const express = require('express');
// const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')
const cors = require('cors')
const upload = require('express-fileupload');
// const formidableMiddleware = require('express-formidable');
const path = require('path');
const app = express();
app.use(upload())
app.use(cors())
// app.use(bodyParser.urlencoded({
//     extended: false
// }))
// app.use(bodyParser.json())
// app.use(formidableMiddleware({
//     encoding: 'utf-8',
//     uploadDir: './uploads/',

//     multiples: true,
// }, [{
//         event: 'fileBegin',
//         action: function (req, res, next, name, file) {
//             console.log(res)
//             /* your callback */
//         }
//     },
//     {
//         event: 'field',
//         action: function (req, res, next, name, value) {
//             console.log(res)
//             /* your callback */
//         }
//     }
// ]))

app.use('/api', require('./api'))


app.listen('3000', () => console.log('Server is run, port: 3000'))