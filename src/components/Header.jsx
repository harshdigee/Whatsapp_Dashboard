import ModeToggle from './ModeToggle'
import ThemeToggle from './ThemeToggle'
import useChatStore from '../store/chatStore'

export default function Header({ activeChat }) {
  const aiMode = useChatStore((s) => s.aiMode)
  const setAiMode = useChatStore((s) => s.setAiMode)
  const connectionStatus = useChatStore((s) => s.connectionStatus)

  const statusColor =
    connectionStatus === 'connected'
      ? 'bg-emerald-400'
      : connectionStatus === 'connecting'
        ? 'bg-amber-400'
        : 'bg-rose-400'

  const statusLabel =
    connectionStatus === 'connected'
      ? 'Connected'
      : connectionStatus === 'connecting'
        ? 'Connecting…'
        : 'Disconnected'

  const online = activeChat?.online

  return (
    <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white shadow-sm">
            {activeChat
              ? (activeChat.name || activeChat.phone || '?')[0]?.toUpperCase()
              : 'AI'}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm dark:border-slate-900 ${
              online ? 'bg-emerald-400' : 'bg-slate-400'
            }`}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
            {activeChat ? activeChat.name || activeChat.phone : 'No conversation selected'}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span
              className={`inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  online ? 'bg-emerald-400' : 'bg-slate-400'
                }`}
              />
              {online ? 'Online' : 'Offline'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px]">
              <span className={`h-1.5 w-1.5 rounded-full ${statusColor}`} />
              <span>{statusLabel}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle enabled={aiMode} onChange={setAiMode} />
        <ThemeToggle />
      </div>
    </header>
  )
}

