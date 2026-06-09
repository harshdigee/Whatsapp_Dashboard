import { memo } from 'react'
import { formatTime } from '../utils/formatTime'

function AudioPlayer({ src }) {
  return (
    <audio
      controls
      src={src}
      style={{ width: '260px', height: '40px' }}
    />
  )
}

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
        {message.message_type === 'image' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <img
              src={message.image_url}
              alt="User image"
              style={{
                width: '260px',
                height: 'auto',
                borderRadius: '8px',
                display: 'block',
                objectFit: 'contain',
              }}
            />
            {message.image_analysis && (
              <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                🖼️ {message.image_analysis}
              </span>
            )}
          </div>
        ) : message.message_type === 'audio' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <AudioPlayer src={message.audio_url} />
            {message.transcript && (
              <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                🎤 {message.transcript}
              </span>
            )}
          </div>
        ) : (
          <span>{text}</span>
        )}
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
