const express = require('express')
const router = express.Router()
const { receiveMessage, getMessages } = require('../controllers/messageController')

// POST /api/messages — called by n8n to ingest incoming WhatsApp messages
router.post('/', receiveMessage)

// GET /api/messages/:chatId — fetch all messages for a chat
router.get('/:chatId', getMessages)

module.exports = router
