import { memo, useMemo, useState } from 'react'
import useChatStore from '../store/chatStore'

const AVATAR_COLORS = [
  '#0f3460',
  '#e94560',
  '#533483',
  '#0f7173',
  '#b5179e',
  '#7209b7',
]

function hashToColor(id) {
  const s = String(id ?? '')
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

function initialsFor(chat) {
  const name = chat.name || chat.phone || chat.id || '?'
  const parts = String(name).trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).slice(0, 2).toUpperCase()
  }
  return String(name).slice(0, 2).toUpperCase()
}

const ChatItem = memo(function ChatItem({ chat, active, onClick, avatarBg }) {
  const displayName = chat.name || chat.phone || chat.id
  const last =
    chat.lastMessage ?? chat.last_message ?? 'No messages yet'
  const lastAt = chat.lastMessageAt ?? chat.last_timestamp

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[72px] w-full shrink-0 items-center gap-3 px-4 py-3 text-left transition-colors ${
        active
          ? 'border-l-[3px] border-[#0f3460] bg-[#16213e]'
          : 'border-l-[3px] border-transparent hover:bg-white/5'
      }`}
    >
      <div className="relative shrink-0">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
          style={{ backgroundColor: avatarBg }}
        >
          {initialsFor(chat)}
        </div>
        {chat.online && (
          <span
            className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1a2e] bg-[#22c55e]"
            aria-hidden
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[14px] font-bold text-[#e2e8f0]">{displayName}</p>
          {lastAt && (
            <span className="shrink-0 text-[11px] text-slate-400">
              {new Date(lastAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[12px] text-slate-400">{last}</p>
      </div>
      {chat.unreadCount > 0 && (
        <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
        </span>
      )}
    </button>
  )
})

function ChatSkeleton() {
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

export default function Sidebar({ onSignOut }) {
  const rawChats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const selectChat = useChatStore((state) => state.selectChat)
  const clearUnread = useChatStore((state) => state.clearUnread)
  const loadingChats = useChatStore((state) => state.loadingChats)

  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const list = Array.isArray(rawChats) ? rawChats : []
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((c) => {
      const name = String(c.name || '').toLowerCase()
      const phone = String(c.phone || '').toLowerCase()
      const id = String(c.id || '').toLowerCase()
      return name.includes(q) || phone.includes(q) || id.includes(q)
    })
  }, [rawChats, query])

  const handleSelect = async (id) => {
    await selectChat(id)
    clearUnread(id)
  }

  return (
    <aside className="flex h-full w-full shrink-0 flex-col overflow-hidden bg-[#1a1a2e] text-[#e2e8f0] md:w-[320px] md:min-w-[320px]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f3460] text-sm font-bold text-white">
            WA
          </div>
          <span className="truncate text-sm font-semibold text-[#e2e8f0]">
            WhatsApp Dashboard
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
        <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 focus-within:ring-[#0f3460]">
          <span className="text-slate-400" aria-hidden>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full border-0 bg-transparent text-sm text-[#e2e8f0] placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth">
        {loadingChats && (
          <div className="space-y-1 py-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <ChatSkeleton key={idx} />
            ))}
          </div>
        )}

        {!loadingChats && filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-xs text-slate-500">
            {!Array.isArray(rawChats) || rawChats.length === 0
              ? 'Waiting for WhatsApp conversations…'
              : 'No contacts match your search.'}
          </div>
        )}

        {!loadingChats &&
          filtered.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              active={chat.id === selectedChatId}
              avatarBg={hashToColor(chat.id)}
              onClick={() => handleSelect(chat.id)}
            />
          ))}
      </div>
    </aside>
  )
}
