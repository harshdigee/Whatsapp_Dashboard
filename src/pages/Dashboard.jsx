import { useEffect, useState } from 'react'
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  const handleChatSelect = () => {
    setIsSidebarOpen(false)
  }

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true)
  }

  return (
    <ErrorBoundary>
      {/* Root container — use 100dvh for true viewport height on mobile */}
      <div className="flex h-[100dvh] overflow-hidden bg-white dark:bg-[#0d1117]">
        
        {/* ── SIDEBAR ──────────────────────────────────────────────
            Mobile (<768px):
              - position: fixed (overlays)
              - full viewport height
              - slides from left with translateX
              - z-index: 40 (above backdrop)
              - appears/disappears via isSidebarOpen state
            
            Desktop (≥768px):
              - position: static (normal flow)
              - width: 320px
              - always visible
              - no transform, no z-index needed
        ───────────────────────────────────────────────────────── */}
        <div
          className={`
            fixed md:static
            top-0 left-0
            h-[100dvh] md:h-full
            w-[280px]
            bg-[#1a1a2e]
            transform transition-transform duration-300
            z-40
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0
          `}
        >
          <ErrorBoundary>
            <Sidebar
              onSignOut={onSignOut}
              onChatSelect={handleChatSelect}
            />
          </ErrorBoundary>
        </div>

        {/* ── MOBILE BACKDROP ──────────────────────────────────────
            Only visible on mobile when sidebar is open.
            - Positioned behind sidebar (z-30 < z-40)
            - Clicking closes sidebar
            - Smooth opacity transition
            - Hidden on desktop via md:hidden
        ───────────────────────────────────────────────────────── */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              transition: 'opacity 300ms ease-in-out',
            }}
            aria-hidden="true"
          />
        )}

        {/* ── CHAT SECTION ──────────────────────────────────────────
            Mobile (<768px):
              - Always full width (100vw - but constrained by parent flex)
              - Fixed sidebar is outside flex flow
              - Takes full height
              - Chat content fills remaining space
            
            Desktop (≥768px):
              - flex-1 to fill remaining space beside sidebar
              - min-w-0 prevents text overflow
              - normal flex layout
        ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 w-full md:min-w-0 h-[100dvh] md:h-full">
          <ErrorBoundary>
            <ChatWindow
              onSignOut={onSignOut}
              onOpenSidebar={handleOpenSidebar}
            />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  )
}
