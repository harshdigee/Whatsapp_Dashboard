const express = require('express')
const router = express.Router()
const { getChats, markChatRead } = require('../controllers/chatController')

// GET /api/chats — fetch all chats sorted by latest message
router.get('/', getChats)

// POST /api/chats/:chatId/read — reset unread_count when a chat is opened
router.post('/:chatId/read', markChatRead)

module.exports = router
