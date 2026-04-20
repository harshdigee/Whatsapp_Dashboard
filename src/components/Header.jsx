import ModeToggle from './ModeToggle'
import ThemeToggle from './ThemeToggle'
import useChatStore from '../store/chatStore'

export default function Header({ activeChat, onSignOut, onOpenSidebar, isMobile }) {
  const aiMode = useChatStore((s) => s.aiMode)
  const setAiMode = useChatStore((s) => s.setAiMode)
  const connectionStatus = useChatStore((s) => s.connectionStatus)

  const statusLabel =
    connectionStatus === 'connected'
      ? 'Connected'
      : connectionStatus === 'connecting'
        ? 'Connecting…'
        : 'Disconnected'

  const statusOk = connectionStatus === 'connected'
  const online = activeChat?.online

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 bg-white px-4 dark:border-[#30363d] dark:bg-[#161b22]">
      {/* Left section: hamburger (mobile only) + avatar + info */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Hamburger menu — visible only on mobile */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Open contacts"
        >
          <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
          <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
          <span className="block w-5 h-0.5 bg-slate-900 dark:bg-slate-200 rounded" />
        </button>

        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0f3460] text-sm font-bold text-white">
            {activeChat
              ? (activeChat.name || activeChat.phone || '?')[0]?.toUpperCase()
              : '?'}
          </div>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[#161b22] ${
              online ? 'bg-[#22c55e]' : 'bg-slate-400'
            }`}
          />
        </div>

        {/* Name, phone, and status */}
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-[#1a1a2e] dark:text-[#e2e8f0]">
            {activeChat ? activeChat.name || activeChat.phone : '—'}
          </p>
          <p className="truncate text-[13px] text-slate-500 dark:text-slate-400">
            {activeChat?.phone || activeChat?.id || ''}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-[#22c55e]' : 'bg-slate-400'}`} />
              {online ? 'Online' : 'Offline'}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${statusOk ? 'bg-[#22c55e]' : 'bg-amber-500'}`} />
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: toggles + sign out */}
      <div className="flex shrink-0 items-center gap-2">
        <ModeToggle enabled={aiMode} onChange={setAiMode} />
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
  )
}
