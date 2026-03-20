/* AI mode toggle: when ON, AI controls the conversation and input is disabled */
export default function ModeToggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center rounded-full px-1 py-0.5 text-xs font-medium transition-colors ${
        enabled
          ? 'bg-brand-500 text-white shadow-sm'
          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
      }`}
    >
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0'
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${
            enabled ? 'bg-emerald-300' : 'bg-slate-400'
          }`}
        />
        <span>{enabled ? 'AI mode' : 'Manual'}</span>
      </span>
    </button>
  )
}

