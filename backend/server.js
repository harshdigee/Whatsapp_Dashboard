require('dotenv').config()

const express = require('express')
const http = require('http')
const cors = require('cors')
const { initSocket } = require('./services/socket')

// Routes
const messagesRouter = require('./routes/messages')
const chatsRouter = require('./routes/chats')
const modeRouter = require('./routes/mode')
const sendMessageRouter = require('./routes/sendMessage')

const app = express()
const httpServer = http.createServer(app)

// ─── Socket.io ────────────────────────────────────────────────────────────────
initSocket(httpServer)

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Request logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/messages', messagesRouter)
app.use('/api/chats', chatsRouter)
app.use('/api/mode', modeRouter)
app.use('/api/send-message', sendMessageRouter)

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error', message: err.message })
})

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000

httpServer.listen(PORT, () => {
  console.log('')
  console.log('╔══════════════════════════════════════════════╗')
  console.log('║   WhatsApp AI Dashboard — Backend Server     ║')
  console.log('╠══════════════════════════════════════════════╣')
  console.log(`║  🚀 Running on   : http://localhost:${PORT}      ║`)
  console.log(`║  🌍 Environment  : ${process.env.NODE_ENV || 'development'}                ║`)
  console.log(`║  🔌 Socket.io    : enabled                   ║`)
  console.log(`║  🗄️  Supabase     : connected                 ║`)
  console.log('╚══════════════════════════════════════════════╝')
  console.log('')
})
