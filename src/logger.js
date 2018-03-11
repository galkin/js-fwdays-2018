const {createLogger, stdSerializers} = require('bunyan')
const {name, version} = require('../package.json')

const logger = createLogger({
  name,
  version,
  streams: [{
    name: 'stdout',
    level: process.env.LOG_LEVEL || 'trace',
    stream: process.stdout
  }],
  serializers: {
    error: stdSerializers.err
  }
})

logger.setLevel = (level) => {
  logger.levels('stdout', level)
}

module.exports = logger
