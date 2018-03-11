const path = require('path')

require('dotenv-safe').load({
  allowEmptyValues: true,
  path: path.join(__dirname, '..', '.env'),
  sample: path.join(__dirname, '..', '.env.example')
})
const logger = require('./logger')

logger.setLevel(process.env.LOG_LEVEL)

module.exports = {
  shutdownTimeout: process.env.SHUTDOWN_TIMEOUT,
  http: {
    port: process.env.HTTP_PORT
  },
  cache: {
    defaultValueLength: parseInt(process.env.CACHE_DEFAULT_VALUE_LENGTH, 0),
    maxAmount: parseInt(process.env.CACHE_MAX_AMOUNT, 0),
    collectionName: process.env.CACHE_COLLECTION_NAME,
    ttl: parseInt(process.env.CACHE_TTL, 0)
  },
  db: {
    uri: process.env.MONGODB_CONNECTION_STRING
  }
}
