const express = require('express')

const cache = require('../../controls/cache')
const {checkConnection} = require('../db')
const logger = require('../../logger')

const router = express.Router()
const app = express()

app.use(express.json())

router.use((req, res, next) => {
  if (checkConnection()) return next()
  res.status(500).json({code: 500, message: 'DB is offline'})
})

router.get('/cache', async (req, res) => res.json(await cache.getAllKeys()))
router.patch('/cache', async (req, res) => {
  await cache.set(req.body.key, req.body.value)
  res.sendStatus(204)
})
router.delete('/cache', async (req, res) => {
  await cache.clearAll()
  res.sendStatus(204)
})
router.get('/cache/:key', async (req, res) => res.json(await cache.get(req.params.key)))
router.delete('/cache/:key', async (req, res) => {
  await cache.clear(req.params.key)
  res.sendStatus(204)
})
router.use((req, res) => {
  logger.debug({req}, 'Not Found')
  res.status(404).json({code: 404, message: 'Not Found'})
})

app.use('/api/v0', router)

module.exports = app
