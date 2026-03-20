const supabase = require('../config/supabase')
const { emitChatUpdated } = require('../services/socket')

/**
 * GET /api/chats
 * Return all chats sorted by last_timestamp descending.
 */
async function getChats(req, res) {
  try {
    console.log('📋 Fetching all chats from Supabase...')

    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .order('last_timestamp', { ascending: false })

    if (error) {
      console.error('❌ Error fetching chats:', error)
      return res.status(500).json({ error: 'Failed to fetch chats', details: error.message })
    }

    console.log(`✅ Fetched ${chats?.length || 0} chats from database`)

    // Normalize field names for the frontend
    const normalized = (chats || []).map((c) => ({
      id: c.chat_id,
      name: c.name || null,
      phone: c.phone || c.chat_id,
      lastMessage: c.last_message,
      lastMessageAt: c.last_timestamp,
      unreadCount: c.unread_count || 0,
      mode: c.mode || 'ai',
      online: c.online || false,
    }))

    console.log('📤 Returning normalized chats:', normalized.map(c => ({ id: c.id, lastMessage: c.lastMessage?.substring(0, 30) + '...' })))

    return res.status(200).json(normalized)
  } catch (error) {
    console.error('❌ getChats error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

/**
 * POST /api/chats/:chatId/read
 * Reset unread_count to 0 when a chat is opened.
 */
async function markChatRead(req, res) {
  try {
    const { chatId } = req.params

    console.log('👁️ Marking chat as read:', chatId)

    const { data: updatedChat, error } = await supabase
      .from('chats')
      .update({ unread_count: 0 })
      .eq('chat_id', chatId)
      .select()
      .single()

    if (error) {
      console.error('❌ Error marking chat as read:', error)
      return res.status(500).json({ error: 'Failed to mark chat as read', details: error.message })
    }

    if (!updatedChat) {
      console.error('❌ Chat not found:', chatId)
      return res.status(404).json({ error: `Chat ${chatId} not found` })
    }

    emitChatUpdated(updatedChat)

    console.log(`✅ Chat ${chatId} marked as read`)
    return res.status(200).json({ success: true, chat: updatedChat })
  } catch (error) {
    console.error('❌ markChatRead error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

module.exports = { getChats, markChatRead }
