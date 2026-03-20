const supabase = require('../config/supabase')
const { emitChatUpdated } = require('../services/socket')

/**
 * POST /api/mode
 * Toggle AI / manual mode for a specific chat.
 */
async function setMode(req, res) {
  try {
    const { chatId, mode } = req.body

    console.log('🤖 Setting mode:', { chatId, mode })

    if (!chatId || !mode) {
      console.error('❌ Missing required fields:', { chatId: !!chatId, mode: !!mode })
      return res.status(400).json({ error: 'chatId and mode are required' })
    }

    if (!['ai', 'manual'].includes(mode)) {
      console.error('❌ Invalid mode:', mode)
      return res.status(400).json({ error: 'mode must be "ai" or "manual"' })
    }

    const { data: updatedChat, error } = await supabase
      .from('chats')
      .update({ mode })
      .eq('chat_id', chatId)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating mode:', error)
      return res.status(500).json({ error: 'Failed to update mode', details: error.message })
    }

    if (!updatedChat) {
      console.error('❌ Chat not found:', chatId)
      return res.status(404).json({ error: `Chat ${chatId} not found` })
    }

    emitChatUpdated(updatedChat)

    console.log(`✅ Mode for chat ${chatId} set to "${mode}"`)
    return res.status(200).json({ success: true, chat: updatedChat })
  } catch (error) {
    console.error('❌ setMode error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

module.exports = { setMode }
