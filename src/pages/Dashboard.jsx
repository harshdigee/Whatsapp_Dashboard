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
      <div className="flex h-[100dvh] w-screen max-w-[100vw] flex-col overflow-hidden md:flex-row">
        <ErrorBoundary>
          <Sidebar onSignOut={onSignOut} />
        </ErrorBoundary>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <ErrorBoundary>
            <ChatWindow onSignOut={onSignOut} />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  )
}
