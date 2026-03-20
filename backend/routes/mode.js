const express = require('express')
const router = express.Router()
const { setMode } = require('../controllers/modeController')

// POST /api/mode — toggle AI / manual mode for a chat
router.post('/', setMode)

module.exports = router
