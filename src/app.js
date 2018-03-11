const logger = require('./logger')
const settings = require('./settings')
const isTest = process.env.NODE_ENV === 'test'
/** Set the most important application events handlers */
if (!isTest) {
  process.on('SIGUSER1', () => {
    logger.info('Received debug signal SIGUSER1')
  })

  process.on('unhandledRejection', (reason) => {
    logger.fatal({error: reason}, 'Unhandled Rejection')
    process.exit(1)
  })

  process.on('uncaughtException', (error) => {
    logger.fatal(error, 'Unhandled Exception')
    process.exit(1)
  })

  process.on('warning', (error) => {
    logger.error(error, 'Warning detected')
  })

  process.on('exit', (code) => {
    logger.info(`Stopped with code: ${code}`)
  })
}

async function start () {
  logger.info('Starting...')

  if (!isTest) {
    ['SIGTERM', 'SIGINT', 'SIGHUP'].forEach((sigEvent) => {
      process.on(sigEvent, () => this.stop())
    })
  }

  try {
    await _start()
  } catch (error) {
    if (!isTest) {
      logger.error(error, 'Error during startup')
      process.exit(1)
    } else {
      throw error
    }
  }

  logger.info('Started')
}

async function stop () {
  logger.info('Stopping...')

  // Last resort fallback to shutdown application no matter what
  const timeoutId = setTimeout(() => {
    if (!isTest) {
      logger.error('Stopped forcefully, but we have something in Event Loop')
      process.exit(1)
    }
  }, settings.shutdownTimeout)

  try {
    await _stop()
    if (!isTest) {
      timeoutId.unref()
    } else {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    if (!isTest) {
      logger.error(error, 'Error during shutdown')
      process.exit(1)
    } else {
      throw error
    }
  }
}

// End of boilerplate code

const rest = require('./boundaries/rest')
const db = require('./boundaries/db')

async function _start () {
  await db.start()
  await rest.start()
}

async function _stop () {
  await rest.stop()
  await db.stop()
}

module.exports = {
  start,
  stop
}
