const supabase = require('../config/supabase')
const { emitNewMessage, emitChatUpdated } = require('../services/socket')
const { forwardToN8n } = require('../services/n8nService')

/**
 * POST /api/send-message
 * Send a manual (human-agent) message to a chat.
 * Inserts into DB, updates chat, calls n8n, and emits socket events.
 */
async function sendMessage(req, res) {
  try {
    const { chatId, message } = req.body

    console.log('📤 Sending manual message:', { chatId, message: message?.substring(0, 50) + '...' })

    if (!chatId || !message) {
      console.error('❌ Missing required fields:', { chatId: !!chatId, message: !!message })
      return res.status(400).json({ error: 'chatId and message are required' })
    }

    const timestamp = new Date().toISOString()

    // Insert message with sender = "human"
    console.log('📝 Inserting human message into database...')
    const { data: newMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender: 'human',
        message,
        timestamp,
      })
      .select()
      .single()

    if (msgError) {
      console.error('❌ Error inserting message:', msgError)
      return res.status(500).json({ error: 'Failed to save message', details: msgError.message })
    }

    console.log('✅ Human message inserted:', newMessage.id)

    // Update chat's last_message
    console.log('💾 Updating chat last_message...')
    const { data: updatedChat, error: chatError } = await supabase
      .from('chats')
      .update({ last_message: message, last_timestamp: timestamp })
      .eq('chat_id', chatId)
      .select()
      .single()

    if (chatError) {
      console.error('❌ Error updating chat:', chatError)
      // Non-fatal — continue
    } else {
      console.log('✅ Chat updated successfully')
    }

    // Emit realtime events immediately
    const messagePayload = {
      id: newMessage.id,
      chatId,
      content: message,
      from: 'human',
      timestamp,
    }
    emitNewMessage(messagePayload)
    if (updatedChat) emitChatUpdated(updatedChat)

    // Forward to n8n (non-blocking — don't fail the request if n8n is down)
    forwardToN8n(chatId, message).catch((err) => {
      console.warn(`⚠️ n8n forward failed for chat ${chatId}:`, err.message)
    })

    console.log(`✅ Manual message sent successfully — chat: ${chatId}`)
    return res.status(201).json({ message: messagePayload })
  } catch (error) {
    console.error('❌ sendMessage error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

module.exports = { sendMessage }
