import { useEffect, useRef, useState } from 'react'
import useChatStore from '../store/chatStore'
import MessageBubble from './MessageBubble'
import Header from './Header'

function TypingIndicator() {
  return (
    <div className="flex justify-start px-5 pb-2">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-[#30363d] dark:bg-[#21262d] dark:text-slate-300">
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

export default function ChatWindow({ onSignOut }) {
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef(null)
  const scrollRef = useRef(null)

  const selectedChatId = useChatStore((state) => state.selectedChatId)
  const chats = useChatStore((state) => state.chats)
  const messages = useChatStore((state) => state.messages)
  const aiMode = useChatStore((state) => state.aiMode)
  const sending = useChatStore((state) => state.sending)
  const typingChatId = useChatStore((state) => state.typingChatId)
  const sendMessage = useChatStore((state) => state.sendMessage)

  const activeChat = chats.find((c) => c.id === selectedChatId) || null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, typingChatId, selectedChatId])

  const handleSend = async () => {
    if (!selectedChatId || !draft.trim() || aiMode) return
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
      <section className="flex h-full min-h-0 flex-1 flex-col bg-[#f0f2f5] dark:bg-[#0d1117]">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0f3460]/15 text-4xl text-[#0f3460] dark:bg-[#0f3460]/30 dark:text-[#93c5fd]">
            💬
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[#1a1a2e] dark:text-[#e2e8f0]">
              Select a conversation to start
            </p>
            <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
              Choose a chat from the sidebar to view messages and reply.
            </p>
          </div>
        </div>
      </section>
    )
  }

  const isTypingHere = typingChatId === selectedChatId

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-[#f0f2f5] dark:bg-[#0d1117]">
      <Header activeChat={activeChat} onSignOut={onSignOut} />

      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto scroll-smooth py-5"
      >
        {messages.map((m, idx) => (
          <MessageBubble
            key={m.id || `${m.timestamp}-${idx}`}
            message={m}
          />
        ))}
        {isTypingHere && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 dark:border-[#30363d] dark:bg-[#1c1c2e]">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              aiMode
                ? 'AI is replying automatically…'
                : 'Type a message…'
            }
            disabled={aiMode || sending}
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#1a1a2e] shadow-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-[#0f3460] focus:ring-1 focus:ring-[#0f3460]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#30363d] dark:bg-[#161b22] dark:text-[#e2e8f0] dark:placeholder:text-slate-500 dark:focus:border-[#0f3460]"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={aiMode || sending || !draft.trim()}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f3460] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c2a4d] disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-600"
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
          {aiMode
            ? 'AI mode is ON — manual sending disabled.'
            : 'Manual mode — messages send as agent.'}
        </p>
      </div>
    </section>
  )
}
