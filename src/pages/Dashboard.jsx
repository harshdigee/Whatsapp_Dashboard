import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import ErrorBoundary from '../components/ErrorBoundary'
import useChatStore from '../store/chatStore'
import socket, { prepareSocketAuth } from '../services/socket'

export default function Dashboard({ onSignOut }) {
  const loadChats = useChatStore((s) => s.loadChats)
  const receiveMessage = useChatStore((s) => s.receiveMessage)
  const setTyping = useChatStore((s) => s.setTyping)
  const setConnectionStatus = useChatStore((s) => s.setConnectionStatus)

  useEffect(() => {
    console.log('🚀 Dashboard mounted, loading chats from backend...')
    loadChats()
  }, [loadChats])

  useEffect(() => {
    let cancelled = false
    setConnectionStatus('connecting')

    const onConnect = () => setConnectionStatus('connected')
    const onDisconnect = () => setConnectionStatus('disconnected')
    const onConnectError = () => setConnectionStatus('disconnected')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    const onNewMessage = (payload) => {
      if (!payload || !payload.chatId) return
      receiveMessage(payload.chatId, payload)
    }
    const onTyping = ({ chatId, typing }) => {
      if (!chatId) return
      setTyping(chatId, typing)
    }

    socket.on('new_message', onNewMessage)
    socket.on('typing', onTyping)

    void (async () => {
      await prepareSocketAuth()
      if (!cancelled) socket.connect()
    })()

    return () => {
      cancelled = true
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.off('new_message', onNewMessage)
      socket.off('typing', onTyping)
      socket.disconnect()
    }
  }, [receiveMessage, setTyping, setConnectionStatus])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-100/70 p-2 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <div className="mx-auto flex h-[calc(100vh-1rem)] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950">
          <div className="hidden w-72 border-r border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100/80 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 md:block">
            <ErrorBoundary>
              <Sidebar />
            </ErrorBoundary>
          </div>
          <div className="flex flex-1 flex-col">
            <div className="block border-b border-slate-200 bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 md:hidden">
              WhatsApp AI Dashboard
            </div>
            <div className="flex min-h-0 flex-1 flex-col md:flex-row">
              <div className="block border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950/50 md:hidden">
                <ErrorBoundary>
                  <Sidebar />
                </ErrorBoundary>
              </div>
              <ErrorBoundary>
                <ChatWindow onSignOut={onSignOut} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

