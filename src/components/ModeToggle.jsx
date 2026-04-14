export default function ModeToggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex h-9 items-center gap-0 rounded-full bg-slate-200 p-0.5 shadow-inner dark:bg-[#30363d]"
      aria-pressed={enabled}
      aria-label={enabled ? 'AI mode on' : 'Manual mode'}
    >
      <span
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          !enabled
            ? 'bg-white text-slate-900 shadow dark:bg-[#21262d] dark:text-white'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        Manual
      </span>
      <span
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
          enabled
            ? 'bg-[#0f3460] text-white shadow'
            : 'text-slate-500 dark:text-slate-400'
        }`}
      >
        AI
      </span>
    </button>
  )
}
