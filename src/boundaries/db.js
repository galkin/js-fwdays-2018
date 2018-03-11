const {MongoClient} = require('mongodb')

const settings = require('../settings')
const logger = require('../logger')

let db = null

async function start () {
  db = await MongoClient.connect(settings.db.uri)
  logger.info('DB connected')
  await _checkCollection()
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

// @todo: move to migrations
async function _checkCollection () {
  const collections = await db.listCollections({name: settings.cache.collectionName}).toArray()
  const isCahceCollectionExist = !!collections.length
  if (!isCahceCollectionExist) {
    logger.warn('Collection created')
    await db.createCollection(settings.cache.collectionName, {capped: true, size : 5242880000, max: settings.cache.maxAmount})
    await db.collection(settings.cache.collectionName)
      .createIndex({ 'lastRequestedAt': 1 }, { expireAfterSeconds: settings.cache.maxAmount })
  }
}

module.exports = {
  start,
  stop,
  getCollection,
  checkConnection
}
