import { useEffect, useRef } from 'react'
import { formatTime, formatDate } from '../utils/formatTime'
import ThemeToggle from './ThemeToggle'

function DateSeparator({ timestamp }) {
  return (
    <div style={{ textAlign: 'center', margin: '16px 0', fontSize: '11px', color: '#888' }}>
      <span style={{ background: '#e2e8f0', padding: '4px 12px', borderRadius: '12px' }}>
        {formatDate(timestamp)}
      </span>
    </div>
  )
}

function getDateKey(timestamp) {
  if (!timestamp) return ''
  try {
    return new Date(timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })
  } catch {
    return ''
  }
}

function ChatbotMessageBubble({ message }) {
  const role = String(message.role || '').toLowerCase()
  const isUser = role === 'user'
  const isAssistant = role === 'assistant'

  const text = message.content ?? ''
  const time = formatTime(message.created_at)

  const alignItems = isUser ? 'flex-start' : 'flex-end'
  const bubbleRadius = isUser ? '2px 16px 16px 16px' : '16px 2px 16px 16px'
  const bubbleBg = isUser ? '#ffffff' : '#00C2A8'
  const bubbleBorder = isUser ? '1px solid #e2e8f0' : 'none'
  const bubbleColor = isUser ? '#1a1a2e' : '#ffffff'
  const label = isUser ? 'USER' : isAssistant ? 'ASSISTANT' : (role.toUpperCase() || 'MSG')
  const labelColor = isUser ? '#888' : '#00C2A8'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems,
        marginBottom: '12px',
        padding: '0 16px',
      }}
    >
      <span
        style={{
          fontSize: '10px',
          color: labelColor,
          marginBottom: '4px',
          fontWeight: '600',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </span>

      <div
        style={{
          maxWidth: '65%',
          padding: '10px 14px',
          borderRadius: bubbleRadius,
          backgroundColor: bubbleBg,
          border: bubbleBorder,
          color: bubbleColor,
          fontSize: '14px',
          lineHeight: '1.5',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
        }}
      >
        {text}
      </div>

      <span style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>
        {time}
      </span>
    </div>
  )
}

export default function ChatbotWindow({ session, messages, loadingMessages, realtimeSignal, onClose, onSignOut, onOpenSidebar }) {
  const messagesEndRef = useRef(null)

  // Scroll on initial load / session switch / realtime new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages?.length, session?.id, realtimeSignal])

  if (!session) {
    return (
      <section className="flex h-full min-h-0 flex-1 flex-col bg-[#f0f2f5] dark:bg-[#0d1117]">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 bg-white px-4 dark:border-[#30363d] dark:bg-[#161b22]">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={onOpenSidebar}
              className="md:hidden flex flex-col gap-1.5 p-1"
              aria-label="Open sessions"
            >
              <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
              <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
              <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00C2A8]/20 text-xl">
              🤖
            </div>
            <p className="text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">Chatbot</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            {typeof onSignOut === 'function' && (
              <button
                type="button"
                onClick={onSignOut}
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Sign out
              </button>
            )}
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#00C2A8]/15 text-4xl">
            🤖
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
              Select a session to view
            </p>
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Choose a chatbot session from the sidebar to view the conversation.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const shortId = String(session.visitor_id || '').slice(0, 8) + '...'
  const createdDate = session.created_at
    ? new Date(session.created_at).toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : ''

  const messageItems = []
  let lastDateKey = ''
  const msgList = Array.isArray(messages) ? messages : []
  for (let idx = 0; idx < msgList.length; idx++) {
    const m = msgList[idx]
    const dateKey = getDateKey(m.created_at)
    if (dateKey && dateKey !== lastDateKey) {
      messageItems.push({ type: 'date', key: `date-${dateKey}-${idx}`, timestamp: m.created_at })
      lastDateKey = dateKey
    }
    messageItems.push({ type: 'message', key: m.id || `${m.created_at}-${idx}`, message: m })
  }

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-[#f0f2f5] dark:bg-[#0d1117]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 bg-white px-4 dark:border-[#30363d] dark:bg-[#161b22]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Open sessions"
          >
            <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
            <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
            <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
          </button>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/20 text-xl">
            🤖
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">
              {shortId}
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              {String(session.visitor_id || '')} · Created {createdDate}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {typeof onClose === 'function' && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              aria-label="Close session"
            >
              ✕
            </button>
          )}
          {typeof onSignOut === 'function' && (
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scroll-smooth py-5">
        {loadingMessages && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00C2A8] border-t-transparent" />
              <p className="text-xs text-slate-400">Loading messages…</p>
            </div>
          </div>
        )}

        {!loadingMessages && messageItems.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-slate-400">No messages in this session.</p>
          </div>
        )}

        {!loadingMessages &&
          messageItems.map((item) =>
            item.type === 'date' ? (
              <DateSeparator key={item.key} timestamp={item.timestamp} />
            ) : (
              <ChatbotMessageBubble key={item.key} message={item.message} />
            )
          )}
        <div ref={messagesEndRef} />
      </div>
    </section>
  )
}
