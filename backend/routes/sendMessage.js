const express = require('express')
const router = express.Router()
const { sendMessage } = require('../controllers/sendMessageController')

// POST /api/send-message — send a manual human-agent message
router.post('/', sendMessage)

module.exports = router
