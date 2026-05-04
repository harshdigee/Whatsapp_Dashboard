import { memo, useMemo, useState } from 'react'
import { formatTime } from '../utils/formatTime'

function SessionSkeleton() {
  return (
    <div className="flex h-[72px] animate-pulse items-center gap-3 px-4">
      <div className="h-12 w-12 shrink-0 rounded-full bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="h-2.5 w-36 rounded-full bg-white/5" />
      </div>
    </div>
  )
}

const SessionItem = memo(function SessionItem({ session, active, onClick }) {
  const shortId = session.visitor_id
    ? String(session.visitor_id).slice(0, 8) + '...'
    : 'Unknown'

  const lastMsg = session.last_message
    ? String(session.last_message).slice(0, 50)
    : 'No messages yet'

  const createdAt = session.created_at

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[72px] w-full shrink-0 items-center gap-3 px-4 py-3 text-left transition-colors ${
        active
          ? 'border-l-[3px] border-[#00C2A8] bg-[#16213e]'
          : 'border-l-[3px] border-transparent hover:bg-white/5'
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/20 text-sm font-bold text-[#00C2A8] shadow-md">
        🤖
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[14px] font-bold text-[#e2e8f0]">{shortId}</p>
          {createdAt && (
            <span className="shrink-0 text-[11px] text-slate-400">
              {formatTime(createdAt)}
            </span>
          )}
        </div>
        <p className="mt-0.5 w-full truncate text-[12px] text-slate-400">{lastMsg}</p>
        {session.message_count != null && (
          <p className="mt-0.5 text-[10px] text-slate-500">
            {session.message_count} message{session.message_count !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </button>
  )
})

export default function ChatbotSidebar({ sessions, loading, selectedSessionId, onSelectSession, onSignOut }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const list = Array.isArray(sessions) ? sessions : []
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((s) =>
      String(s.visitor_id || '').toLowerCase().includes(q)
    )
  }, [sessions, query])

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-[#1a1a2e] text-[#e2e8f0]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00C2A8]/20 text-lg">
            🤖
          </div>
          <span className="truncate text-sm font-semibold text-[#e2e8f0]">
            Chatbot Sessions
          </span>
        </div>
        {typeof onSignOut === 'function' && (
          <button
            type="button"
            onClick={onSignOut}
            className="shrink-0 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        )}
      </div>

      <div className="shrink-0 border-b border-white/10 px-3 py-3">
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 focus-within:ring-[#00C2A8]">
          <span className="text-slate-400" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by visitor ID..."
            className="w-full border-0 bg-transparent text-sm text-[#e2e8f0] placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
        {loading && (
          <div className="space-y-1 py-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SessionSkeleton key={idx} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-xs text-slate-500">
            {!Array.isArray(sessions) || sessions.length === 0
              ? 'No chatbot sessions found.'
              : 'No sessions match your search.'}
          </div>
        )}

        {!loading &&
          filtered.map((session) => (
            <SessionItem
              key={session.id}
              session={session}
              active={session.id === selectedSessionId}
              onClick={() => onSelectSession(session)}
            />
          ))}
      </div>
    </aside>
  )
}
