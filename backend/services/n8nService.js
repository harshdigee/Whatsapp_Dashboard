const axios = require('axios')

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/send-message'

/**
 * Forward a manual message to n8n for further processing/delivery.
 * @param {string} chatId
 * @param {string} message
 * @returns {Promise<object>}
 */
async function forwardToN8n(chatId, message) {
  try {
    const response = await axios.post(
      N8N_WEBHOOK_URL,
      { chatId, message },
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      }
    )
    console.log(`📤 Forwarded message to n8n for chat ${chatId}`)
    return response.data
  } catch (error) {
    const status = error.response?.status
    const msg = error.response?.data || error.message
    console.error(`❌ n8n webhook error [${status}]:`, msg)
    throw new Error(`n8n webhook failed: ${msg}`)
  }
}

module.exports = { forwardToN8n }
