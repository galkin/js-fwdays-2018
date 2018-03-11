const {randomBytes} = require('crypto')

const settings = require('../settings')
const logger = require('../logger')
const {getCollection} = require('../boundaries/db')

async function get (key) {
  let data = await getCollection(settings.cache.collectionName).findOne({_id: key})
  let value = data ? data.value : undefined;
  if (!value) {
    value = randomBytes(settings.cache.defaultValueLength).toString('hex')
    await set(key, value)
    logger.warn({key, value}, 'Cache miss')
  } else {
    await set(key, value)
    logger.info({key, value}, 'Cache hit')
  }
  return {key, value}
}

async function set (key, value) {
  return getCollection(settings.cache.collectionName)
    .update({_id: key}, {value, lastRequestedAt: new Date()}, {upsert: true})
}

async function getAllKeys () {
  const r = await getCollection(settings.cache.collectionName).find({}, {_id: 1}).toArray()
  return r.map(el => el._id)
}

async function clearAll () {
  return getCollection(settings.cache.collectionName).remove({}, {justOne: false})
}

async function clear (key) {
  return getCollection(settings.cache.collectionName).remove({_id: key}, {justOne: true})
}

module.exports = {
  get,
  clearAll,
  getAllKeys,
  clear,
  set
}
