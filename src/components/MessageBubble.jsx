import { memo } from 'react'

function formatTime(value) {
  const date = value ? new Date(value) : new Date()
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getSender(message) {
  const s = message.sender || message.from
  return String(s || '').toLowerCase()
}

function MessageBubbleInner({ message }) {
  const sender = getSender(message)
  const isUser = sender === 'user'
  const isAi = sender === 'ai' || sender === 'assistant'
  const isHuman = sender === 'human'

  const text = message.content ?? message.message ?? ''
  const time = formatTime(message.timestamp)

  if (isUser) {
    return (
      <div className="flex w-full flex-col items-start gap-1 px-5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          YOU
        </span>
        <div
          className="max-w-[65%] border border-slate-200 bg-white px-[14px] py-2.5 text-[15px] leading-snug text-[#1a1a2e] shadow-sm dark:border-slate-600 dark:bg-[#1e293b] dark:text-[#e2e8f0]"
          style={{ borderRadius: '0 16px 16px 16px' }}
        >
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{time}</span>
      </div>
    )
  }

  if (isAi) {
    return (
      <div className="flex w-full flex-col items-end gap-1 px-5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-[#0f3460] dark:text-[#60a5fa]">
          AI
        </span>
        <div
          className="max-w-[65%] bg-[#0f3460] px-[14px] py-2.5 text-[15px] leading-snug text-white shadow-sm"
          style={{ borderRadius: '16px 0 16px 16px' }}
        >
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{time}</span>
      </div>
    )
  }

  if (isHuman) {
    return (
      <div className="flex w-full flex-col items-end gap-1 px-5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          AGENT
        </span>
        <div
          className="max-w-[65%] bg-[#1a1a2e] px-[14px] py-2.5 text-[15px] leading-snug text-white shadow-sm dark:bg-[#252540]"
          style={{ borderRadius: '16px 0 16px 16px' }}
        >
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">{time}</span>
      </div>
    )
  }

  // Fallback: treat unknown as user (left)
  return (
    <div className="flex w-full flex-col items-start gap-1 px-5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {sender || 'MSG'}
      </span>
      <div
        className="max-w-[65%] border border-slate-200 bg-white px-[14px] py-2.5 text-[#1a1a2e] dark:border-slate-600 dark:bg-[#1e293b] dark:text-[#e2e8f0]"
        style={{ borderRadius: '0 16px 16px 16px' }}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
      </div>
      <span className="text-[10px] text-slate-400">{time}</span>
    </div>
  )
}

const MessageBubble = memo(MessageBubbleInner)
export default MessageBubble
