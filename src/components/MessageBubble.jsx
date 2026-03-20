function formatTime(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function MessageBubble({ message, isLast }) {
  const isAi = message.from === 'ai'
  const alignment = isAi ? 'justify-end' : 'justify-start'
  const bubbleColor = isAi
    ? 'bg-brand-500 text-white'
    : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50'

  const metaColor = isAi
    ? 'text-brand-100/80'
    : 'text-slate-500 dark:text-slate-400'

  return (
    <div className={`flex ${alignment} px-2 ${isLast ? 'pb-2' : 'pb-1'}`}>
      <div className="max-w-[80%] space-y-1">
        <div
          className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${metaColor}`}
        >
          <span
            className={`rounded-full px-1.5 py-0.5 ${
              isAi
                ? 'bg-brand-400/70 text-white'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100'
            }`}
          >
            {isAi ? 'AI' : 'You'}
          </span>
        </div>
        <div
          className={`rounded-2xl px-3 py-2 text-sm shadow-sm transition ${bubbleColor}`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className={`flex text-[10px] ${alignment} ${metaColor}`}>
          <span>{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}

