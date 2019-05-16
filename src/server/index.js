const express = require('express')
const server = express()
const bodyParser = require('body-parser')

const env = require('../env')
const DataHandler = require('./lib/data-handler')

server.use(bodyParser.json());

server.get('/', (req, res)=> {
    res.send('hello world')
})
server.use('/static', express.static('static'))

server.post('/api/', (req, res) => {
    const body = req.body
    const dataHandler = new DataHandler(body.uuid)
    dataHandler.append(body.n, body.v)
    res.send("post: /api/")
})

server.get('/api/file/*', (req, res) => {
  const q = req.query
  const filePath = req.params[0]
  res.header('content-type', 'text/csv')
  res.sendFile(DataHandler.ROOT + "/" + q.uuid + "/" + filePath)
})

server.get('/api/list', (req, res) => {
  const q = req.query
  const dataHandler = new DataHandler(q.uuid)
  const json = dataHandler.list()
  res.header('content-type', 'application/json')
  res.send(JSON.stringify(json))
})

server.use('/my/', express.static('dist'))

server.listen(env.PORT, () => {
    console.log((`Server listening on port: ${env.PORT}!`))
})
