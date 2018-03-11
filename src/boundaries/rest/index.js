const {createServer} = require('http')

const express = require('./express')
const logger = require('../../logger')
const settings = require('../../settings')
const SocketRegistry = require('./socket-registry')

const socketRegistry = new SocketRegistry()
let server = null

async function start () {
  server = createServer(express)
  server.on('connection', socket => socketRegistry.lock(socket))
  return new Promise((resolve, reject) => {
    server.listen(settings.http.port, () => {
      logger.info(`HTTP Server started @ ${settings.http.port}`)
      resolve()
    }).once('error', reject)
  })
}

async function stop () {
  if (!server.listening) throw new Error('Http Server is not listening')
  await socketRegistry.clear()
  return new Promise((resolve, reject) => {
    server.once('close', () => {
      logger.info('HTTP server stopped')
      server = null
      return resolve()
    })
    server.close((err) => {
      if (err) reject(err)
    })
  })
}

module.exports = {
  start,
  stop
}
