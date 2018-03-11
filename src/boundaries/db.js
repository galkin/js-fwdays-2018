const {MongoClient} = require('mongodb')

const settings = require('../settings')
const logger = require('../logger')

let db = null

async function start () {
  db = await MongoClient.connect(settings.db.uri)
  logger.info('DB connected')
}

async function stop () {
  await db.close()
  logger.info('DB disconnected')
}

function getCollection (name) {
  return db.collection(name)
}

function checkConnection () {
  return db.serverConfig.isConnected()
}

module.exports = {
  start,
  stop,
  getCollection,
  checkConnection
}
