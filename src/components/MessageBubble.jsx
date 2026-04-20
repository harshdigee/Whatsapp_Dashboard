import { memo } from 'react'
import { formatTime } from '../utils/formatTime'

function getSender(message) {
  const s = message.sender || message.from
  return String(s || '').toLowerCase()
}

function MessageBubbleInner({ message, isMobile }) {
  const sender = getSender(message)
  const isUser = sender === 'user'
  const isAi = sender === 'ai' || sender === 'assistant'
  const isHuman = sender === 'human'

  const text = message.content ?? message.message ?? ''
  const time = formatTime(message.timestamp)

  const maxWidth = isMobile ? '85%' : '65%'

  const label = isUser ? 'USER' : isAi ? 'AI' : isHuman ? 'AGENT' : (sender || 'MSG')
  const alignItems = isUser ? 'flex-start' : 'flex-end'
  const bubbleRadius = isUser ? '2px 16px 16px 16px' : '16px 2px 16px 16px'
  const bubbleBg = isUser ? '#ffffff' : isAi ? '#0f3460' : '#1a1a2e'
  const bubbleBorder = isUser ? '1px solid #e2e8f0' : 'none'
  const bubbleColor = isUser ? '#1a1a2e' : '#ffffff'
  const labelColor = isUser
    ? '#888'
    : isAi
      ? '#0f3460'
      : '#888'

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
          maxWidth,
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

      <span
        style={{
          fontSize: '10px',
          color: '#888',
          marginTop: '4px',
        }}
      >
        {time}
      </span>
    </div>
  )
}

const MessageBubble = memo(MessageBubbleInner)
export default MessageBubble
