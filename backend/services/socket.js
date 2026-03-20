const { Server } = require('socket.io')

let io = null

/**
 * Initialize Socket.io with the HTTP server.
 * @param {import('http').Server} httpServer
 */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`)

    socket.on('disconnect', (reason) => {
      console.log(`🔌 Client disconnected: ${socket.id} — reason: ${reason}`)
    })
  })

  console.log('✅ Socket.io initialized')
  return io
}

/**
 * Get the active Socket.io instance.
 */
function getIO() {
  if (!io) {
    throw new Error('Socket.io has not been initialized. Call initSocket() first.')
  }
  return io
}

/**
 * Emit a new_message event to all connected clients.
 * @param {object} message
 */
function emitNewMessage(message) {
  getIO().emit('new_message', message)
}

/**
 * Emit a chat_updated event to all connected clients.
 * @param {object} chat
 */
function emitChatUpdated(chat) {
  getIO().emit('chat_updated', chat)
}

module.exports = { initSocket, getIO, emitNewMessage, emitChatUpdated }
