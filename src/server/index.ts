import * as express from 'express'
import * as bodyParser from 'body-parser'
const server = express()

import env from '../env'
import {DataHandler, Mode} from './lib/data-handler'

//console.log(Mode)
const dataHandler = new DataHandler({
  mode: Mode.Database
})

server.use(bodyParser.json());

server.get('/', (_, res)=> {
    res.send('hello world')
})
server.use('/static', express.static('static'))

interface Received {
  uuid: string;
  n: string;
  v: string;
}

server.post('/api/', (req, res) => {
    const body: Received = req.body
    const uuid = req.query.uuid
    dataHandler.append(uuid, body.n, body.v)
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
  const json = dataHandler.list(q.uuid)
  res.header('content-type', 'application/json')
  res.send(JSON.stringify(json))
})

server.use('/my/', express.static('dist'))

server.listen(env.PORT, () => {
    console.log((`Server listening on port: ${env.PORT}!`))
})
