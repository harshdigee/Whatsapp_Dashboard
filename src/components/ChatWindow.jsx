import { useEffect, useRef, useState } from 'react'
import useChatStore from '../store/chatStore'
import MessageBubble from './MessageBubble'
import Header from './Header'

function TypingIndicator() {
  return (
    <div className="flex justify-start px-3 pb-3">
      <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-1.5 text-xs text-slate-500 shadow-sm dark:bg-slate-800 dark:text-slate-300">
        <span className="relative flex h-5 w-8 items-center justify-center">
          <span className="absolute inline-flex h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.32s]" />
          <span className="absolute inline-flex h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.16s] translate-x-2" />
          <span className="absolute inline-flex h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 translate-x-4" />
        </span>
        AI is typing…
      </div>
    </div>
  )
}

export default function ChatWindow() {
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef(null)

  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const chats = useChatStore((state) => state.chats)
  const messages = useChatStore((state) => state.messages)
  const aiMode = useChatStore((state) => state.aiMode)
  const sending = useChatStore((state) => state.sending)
  const typingChatId = useChatStore((state) => state.typingChatId)
  const loadingMessages = useChatStore((state) => state.loadingMessages)
  const sendMessage = useChatStore((state) => state.sendMessage)

  const activeChat = chats.find((c) => c.id === selectedChatId) || null

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages.length, typingChatId])

  const handleSend = async () => {
    if (!selectedChatId || !draft.trim() || aiMode) return
    console.log('🚀 Sending message:', { selectedChatId, message: draft.trim() })
    const content = draft.trim()
    setDraft('')
    await sendMessage(selectedChatId, content)
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  if (!activeChat) {
    return (
      <section className="flex h-full flex-1 flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-center dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-3xl text-brand-500 shadow-sm">
          💬
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Select a WhatsApp conversation
          </p>
          <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
            Monitor and steer AI-powered replies. Choose a chat from the left
            to see the live conversation stream.
          </p>
        </div>
      </section>
    )
  }

  const isTypingHere = typingChatId === selectedChatId

  return (
    <section className="flex h-full flex-1 flex-col">
      <Header activeChat={activeChat} />

      <div className="flex-1 bg-gradient-to-b from-slate-50 to-slate-100/80 px-2 dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto flex h-full max-w-3xl flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto pt-3">
            {messages.map((m, idx) => (
              <MessageBubble
                key={m.id || `${m.timestamp}-${idx}`}
                message={m}
                isLast={idx === messages.length - 1}
              />
            ))}
            {isTypingHere && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 bg-white/90 px-3 pb-3 pt-2 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mx-auto flex max-w-3xl flex-col gap-1">
              <div className="flex items-end gap-2">
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    aiMode
                      ? 'AI is replying automatically…'
                      : 'Type a message to send as You…'
                  }
                  disabled={aiMode || sending}
                  className="max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 transition focus:border-brand-400 focus:bg-white focus:ring-1 focus:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-brand-500 dark:focus:ring-brand-500/70"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={aiMode || sending || !draft.trim()}
                  className="inline-flex h-9 items-center justify-center rounded-2xl bg-brand-500 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
                >
                  Send
                </button>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>
                  {aiMode
                    ? 'AI mode is ON — manual sending disabled.'
                    : 'Manual mode — messages are sent as You.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

