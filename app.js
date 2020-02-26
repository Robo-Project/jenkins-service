const helmet = require('helmet')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./router')

app.use(helmet.frameguard({ action: 'SAMEORIGIN' }))

app.use(cors())
app.use(bodyParser.json())
app.use(router)

module.exports = app
