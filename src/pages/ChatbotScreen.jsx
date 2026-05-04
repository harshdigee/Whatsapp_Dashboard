import { useEffect, useRef, useState, useCallback } from 'react'
import { chatbotSupabase } from '../lib/chatbotSupabase'
import ChatbotSidebar from '../components/ChatbotSidebar'
import ChatbotWindow from '../components/ChatbotWindow'
import ErrorBoundary from '../components/ErrorBoundary'

export default function ChatbotScreen({ onSignOut }) {
  const [sessions, setSessions] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Incremented each time a realtime message arrives; ChatbotWindow watches it to scroll
  const [realtimeSignal, setRealtimeSignal] = useState(0)
  // Keep selectedSession.id accessible inside the subscription callback without stale closure
  const selectedSessionIdRef = useRef(null)

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true)
    try {
      // Fetch sessions and messages as two flat queries — avoids relying on
      // PostgREST foreign-key relationship being explicitly configured
      const [sessionsResult, messagesResult] = await Promise.all([
        chatbotSupabase
          .from('chat_sessions')
          .select('id, visitor_id, created_at, expires_at')
          .order('created_at', { ascending: false }),
        chatbotSupabase
          .from('messages')
          .select('id, session_id, content, created_at')
          .order('created_at', { ascending: false }),
      ])

      if (sessionsResult.error) {
        console.error('Error fetching chatbot sessions:', sessionsResult.error)
        setSessions([])
        return
      }

      const allMessages = messagesResult.data || []

      // Group messages by session_id for O(n) lookup
      const msgsBySession = {}
      for (const msg of allMessages) {
        if (!msgsBySession[msg.session_id]) msgsBySession[msg.session_id] = []
        msgsBySession[msg.session_id].push(msg)
      }

      const enriched = (sessionsResult.data || []).map((session) => {
        const msgs = msgsBySession[session.id] || []
        // msgs are already ordered desc from the query
        return {
          ...session,
          message_count: msgs.length,
          last_message: msgs[0]?.content ?? null,
        }
      })

      setSessions(enriched)
    } catch (err) {
      console.error('Unexpected error loading sessions:', err)
      setSessions([])
    } finally {
      setLoadingSessions(false)
    }
  }, [])

  const loadMessages = useCallback(async (sessionId) => {
    if (!sessionId) return
    setLoadingMessages(true)
    setMessages([])
    try {
      const { data, error } = await chatbotSupabase
        .from('messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching chatbot messages:', error)
        setMessages([])
        return
      }
      setMessages(data || [])
    } catch (err) {
      console.error('Unexpected error loading messages:', err)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  // Keep the ref in sync so the realtime callback always reads the current session id
  useEffect(() => {
    selectedSessionIdRef.current = selectedSession?.id ?? null
  }, [selectedSession?.id])

  // Realtime subscription — re-subscribes whenever the selected session changes
  useEffect(() => {
    const sessionId = selectedSession?.id
    if (!sessionId) return

    const channel = chatbotSupabase
      .channel(`messages:session_id=eq.${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          // Guard: only append if the event is for the currently viewed session
          if (payload.new?.session_id !== selectedSessionIdRef.current) return
          setMessages((prev) => [...prev, payload.new])
          setRealtimeSignal((n) => n + 1)
        }
      )
      .subscribe()

    return () => {
      chatbotSupabase.removeChannel(channel)
    }
  }, [selectedSession?.id])

  const handleSelectSession = useCallback((session) => {
    setSelectedSession(session)
    setIsSidebarOpen(false)
    loadMessages(session.id)
  }, [loadMessages])

  const handleClose = useCallback(() => {
    setSelectedSession(null)
    setMessages([])
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex h-[100dvh] overflow-hidden bg-white dark:bg-[#0d1117]">

        {/* Sidebar */}
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
            <ChatbotSidebar
              sessions={sessions}
              loading={loadingSessions}
              selectedSessionId={selectedSession?.id}
              onSelectSession={handleSelectSession}
              onSignOut={onSignOut}
            />
          </ErrorBoundary>
        </div>

        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            style={{ transition: 'opacity 300ms ease-in-out' }}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 w-full md:min-w-0 h-[100dvh] md:h-full">
          <ErrorBoundary>
            <ChatbotWindow
              session={selectedSession}
              messages={messages}
              loadingMessages={loadingMessages}
              realtimeSignal={realtimeSignal}
              onClose={handleClose}
              onSignOut={onSignOut}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  )
}
