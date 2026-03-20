import useChatStore from '../store/chatStore'

function ChatSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-100/80 p-3 dark:bg-slate-800/60">
      <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
    </div>
  )
}

function ChatItem({ chat, active, onClick }) {
  const initials =
    chat.name?.charAt(0)?.toUpperCase() ||
    chat.phone?.slice(-2) ||
    '?'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm transition-all ${
        active
          ? 'border-brand-400 bg-brand-50 text-brand-900 shadow-sm dark:border-brand-500/70 dark:bg-brand-500/10 dark:text-brand-50'
          : 'border-transparent bg-white text-slate-800 shadow-sm hover:border-brand-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-500/40 dark:hover:bg-slate-800'
      }`}
    >
      <div className="relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white shadow-sm">
          {initials}
        </div>
        {chat.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 shadow-sm dark:border-slate-900" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center justify-between gap-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            {chat.name || chat.phone}
          </p>
          {chat.lastMessageAt && (
            <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
              {new Date(chat.lastMessageAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
          {chat.lastMessage || 'No messages yet'}
        </p>
      </div>
      {chat.unreadCount > 0 && (
        <span className="ml-1 inline-flex min-h-[1.25rem] min-w-[1.25rem] items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white shadow-sm">
          {chat.unreadCount}
        </span>
      )}
    </button>
  )
}

export default function Sidebar() {
  const rawChats = useChatStore((state) => state.chats)
  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const selectChat = useChatStore((state) => state.selectChat)
  const clearUnread = useChatStore((state) => state.clearUnread)
  const loadingChats = useChatStore((state) => state.loadingChats)

  const chats = Array.isArray(rawChats) ? rawChats : []

  const handleSelect = async (id) => {
    await selectChat(id)
    clearUnread(id)
  }

  return (
    <aside className="flex h-full flex-col gap-3 border-r border-slate-200 bg-slate-50/60 p-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/30">
      <div className="px-1">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Chats
        </label>
        <div className="mt-1 flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-500 shadow-sm ring-0 transition focus-within:border-brand-400 focus-within:ring-1 focus-within:ring-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:focus-within:border-brand-500 dark:focus-within:ring-brand-500/70">
          <span className="mr-1.5 text-slate-400">⌕</span>
          <input
            type="text"
            placeholder="Search name or number"
            className="w-full border-none bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto space-y-2 pr-1 pt-1">
          {loadingChats && (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <ChatSkeleton key={idx} />
              ))}
            </div>
          )}

          {!loadingChats && chats.length === 0 && (
            <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-4 text-center text-xs text-slate-400 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-500">
              Waiting for WhatsApp conversations…
            </div>
          )}

          {!loadingChats &&
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                active={chat.id === selectedChatId}
                onClick={() => handleSelect(chat.id)}
              />
            ))}
        </div>
      </div>
    </aside>
  )
}

