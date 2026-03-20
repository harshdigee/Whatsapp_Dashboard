import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { fetchChats, fetchMessages, sendMessage as apiSendMessage } from '../services/api'

const useChatStore = create(
  persist(
    (set, get) => ({
      chats: [],
      selectedChatId: null,
      messages: [], // Single messages array for selected chat
      aiMode: true,
      theme: 'light',
      connectionStatus: 'disconnected',
      loadingChats: false,
      loadingMessages: false,
      sending: false,
      typingChatId: null,

      setTheme: (theme) => {
        set({ theme })
      },

      setConnectionStatus: (status) => set({ connectionStatus: status }),

      setAiMode: (enabled) => set({ aiMode: enabled }),

      selectChat: async (chatId) => {
        console.log('🔄 Selecting chat:', chatId)
        set({ selectedChatId: chatId, loadingMessages: true })

        try {
          const res = await fetchMessages(chatId)
          console.log('✅ Messages loaded from backend:', res.data)
          set({ messages: res.data })
        } catch (error) {
          console.error('❌ Failed to load messages:', error)
          set({ messages: [] })
        } finally {
          set({ loadingMessages: false })
        }
      },

      loadChats: async () => {
        console.log('🔄 Loading chats from backend...')
        set({ loadingChats: true })
        try {
          const res = await fetchChats()
          console.log('✅ Chats loaded from backend:', res.data)
          set({ chats: res.data })
        } catch (error) {
          console.error('❌ Failed to load chats:', error)
          set({ chats: [] })
        } finally {
          set({ loadingChats: false })
        }
      },

      sendMessage: async (chatId, message) => {
        if (!message.trim()) return
        
        console.log('📤 Sending message to backend:', { chatId, message })
        set({ sending: true })

        try {
          // Send to backend
          await apiSendMessage(chatId, message)
          console.log('✅ Message sent to backend successfully')

          // Refetch messages from backend to get updated state
          const res = await fetchMessages(chatId)
          console.log('✅ Messages refetched after send:', res.data)
          set({ messages: res.data })

          // Refetch chats to update chat list
          const chatsRes = await fetchChats()
          set({ chats: chatsRes.data })

        } catch (error) {
          console.error('❌ Send message failed:', error)
        } finally {
          set({ sending: false })
        }
      },

      // Socket event handlers
      receiveMessage: (chatId, message) => {
        console.log('🔔 Received socket message:', { chatId, message })
        const { selectedChatId } = get()
        
        // If message is for currently selected chat, refetch messages
        if (chatId === selectedChatId) {
          get().selectChat(chatId)
        }
        
        // Refetch chats to update chat list
        get().loadChats()
      },

      clearUnread: async (chatId) => {
        console.log('👁️ Marking chat as read:', chatId)
        try {
          // Call backend to mark as read
          await fetch(`http://localhost:5000/api/chats/${chatId}/read`, {
            method: 'POST'
          })
          
          // Refetch chats to get updated unread count
          get().loadChats()
        } catch (error) {
          console.error('❌ Failed to mark chat as read:', error)
        }
      },

      setTyping: (chatId, typing) =>
        set({ typingChatId: typing ? chatId : null }),
    }),
    {
      name: 'whatsapp-dashboard-store',
      partialize: (state) => ({
        theme: state.theme,
        aiMode: state.aiMode,
      }),
    },
  ),
)

export default useChatStore

