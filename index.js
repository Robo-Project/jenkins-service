const https = require('https')
const app = require('./app')
const fs = require('fs')

const config = {
  PORT: 4000
}

const credentials = {
  key: fs.readFileSync('certs/robo.key', 'utf8'),
  cert: fs.readFileSync('certs/robo.crt', 'utf8')
}

const server = https.createServer(credentials, app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
