const {promisify} = require('util')

const {MongoClient} = require('mongodb')

const settings = require('../settings')
const logger = require('../logger')

let wait = promisify(setTimeout)
let db = null
let retryCount = 0

async function start () {
  if (retryCount >= 5) throw new Error('Too many reconnect to DB')
  try {
    db = await MongoClient.connect(settings.db.uri)
    logger.info('DB connected')
    await _checkCollection()
  } catch (e) {
    logger.error(e)
    await wait(1000)
    retryCount += 1
    await start()
  }
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
    await db.createCollection(settings.cache.collectionName, {capped: true, size: 5242880000, max: settings.cache.maxAmount})
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
