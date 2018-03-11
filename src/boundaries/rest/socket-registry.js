const logger = require('../../logger')

class SocketRegistry {
  constructor () {
    this.sockets = {}
    this.socketIndex = 0
  }

  lock (socket) {
    this.sockets[(this.socketIndex += 1)] = socket
    logger.debug(`Connection #${this.socketIndex} from ${socket.remoteAddress} opened`)
    const index = this.socketIndex
    socket.on('close', () => this.unlock(index))
  }

  unlock (index) {
    logger.debug(`Connection #${index} was closed`)
    delete this.sockets[index]
  }

  /**
   * Destroys all locked sockets and clears {SocketRegistry~sockets}
   * to release socket objects from the memory and aid GC.
   */
  async clear () {
    return Promise.all(Object.entries(this.sockets).map(([index, socket]) => {
      logger.debug(`Closing connection #${index}`)
      return new Promise((resolve) => {
        socket.once('close', resolve)
        socket.destroy()
      })
    }))
  }
}

module.exports = SocketRegistry
