const supabase = require('../config/supabase')
const { emitNewMessage, emitChatUpdated } = require('../services/socket')

/**
 * POST /api/messages
 * Called by n8n to ingest incoming WhatsApp messages.
 */
async function receiveMessage(req, res) {
  try {
    const { chatId, sender, message, timestamp } = req.body

    console.log('📥 Received message request:', { chatId, sender, message: message?.substring(0, 50) + '...', timestamp })

    if (!chatId || !sender || !message) {
      console.error('❌ Missing required fields:', { chatId: !!chatId, sender: !!sender, message: !!message })
      return res.status(400).json({ error: 'chatId, sender, and message are required' })
    }

    if (!['user', 'ai', 'human', 'assistant'].includes(sender)) {
      console.error('❌ Invalid sender:', sender)
      return res.status(400).json({ error: 'sender must be "user", "ai", "human", or "assistant"' })
    }

    const messageTimestamp = timestamp || new Date().toISOString()

    // Insert message into messages table
    console.log('📝 Inserting message into Supabase messages table...')
    const { data: newMessage, error: msgError } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender,
        message,
        timestamp: messageTimestamp,
      })
      .select()
      .single()

    if (msgError) {
      console.error('❌ Error inserting message:', msgError)
      return res.status(500).json({ error: 'Failed to save message', details: msgError.message })
    }

    console.log('✅ Message inserted successfully:', newMessage.id)

    // Fetch current chat to check unread_count
    console.log('🔍 Fetching existing chat for unread count...')
    const { data: existingChat, error: fetchError } = await supabase
      .from('chats')
      .select('unread_count')
      .eq('chat_id', chatId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error fetching existing chat:', fetchError)
    }

    const currentUnread = existingChat?.unread_count || 0
    const newUnread = sender === 'user' ? currentUnread + 1 : currentUnread

    console.log('📊 Unread count calculation:', { currentUnread, newUnread, sender })

    // Upsert chat record with latest message info
    console.log('💾 Upserting chat record...')
    const { data: updatedChat, error: chatError } = await supabase
      .from('chats')
      .upsert(
        {
          chat_id: chatId,
          last_message: message,
          last_timestamp: messageTimestamp,
          unread_count: newUnread,
        },
        { onConflict: 'chat_id' }
      )
      .select()
      .single()

    if (chatError) {
      console.error('❌ Error upserting chat:', chatError)
      return res.status(500).json({ error: 'Failed to update chat', details: chatError.message })
    }

    console.log('✅ Chat upserted successfully:', updatedChat.chat_id)

    // Emit realtime events
    const messagePayload = { ...newMessage, chatId }
    emitNewMessage(messagePayload)
    emitChatUpdated(updatedChat)

    console.log(`📨 Message processed successfully — chat: ${chatId}, sender: ${sender}`)
    return res.status(201).json({ message: newMessage, chat: updatedChat })
  } catch (error) {
    console.error('❌ receiveMessage error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

/**
 * GET /api/messages/:chatId
 * Return all messages for a chat sorted by timestamp ascending.
 */
async function getMessages(req, res) {
  try {
    const { chatId } = req.params

    console.log('📖 Fetching messages for chat:', chatId)

    if (!chatId) {
      console.error('❌ Missing chatId parameter')
      return res.status(400).json({ error: 'chatId is required' })
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true })

    if (error) {
      console.error('❌ Error fetching messages:', error)
      return res.status(500).json({ error: 'Failed to fetch messages', details: error.message })
    }

    console.log(`✅ Fetched ${messages?.length || 0} messages for chat ${chatId}`)

    // Normalize field names for the frontend
    const normalized = (messages || []).map((m) => ({
      id: m.id,
      chatId: m.chat_id,
      content: m.message,
      from: m.sender,
      timestamp: m.timestamp,
    }))

    return res.status(200).json(normalized)
  } catch (error) {
    console.error('❌ getMessages error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}

module.exports = { receiveMessage, getMessages }
