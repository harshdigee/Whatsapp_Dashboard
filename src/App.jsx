import { useState } from 'react'
import FullPageSpinner from './components/FullPageSpinner.jsx'
import { useAuth } from './hooks/useAuth'
import AccessDenied from './pages/AccessDenied.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ChatbotScreen from './pages/ChatbotScreen.jsx'

function App() {
  const { session, user, isAllowed, loading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('whatsapp')

  if (loading) return <FullPageSpinner />

  if (!session) return <LoginPage />

  if (!isAllowed) return <AccessDenied user={user} />

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {/* Top navigation tabs */}
      <nav className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-[#1a1a2e] px-4 py-2">
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
          style={
            activeTab === 'whatsapp'
              ? { backgroundColor: '#00C2A8', color: '#ffffff' }
              : { backgroundColor: 'rgba(255,255,255,0.08)', color: '#94a3b8' }
          }
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('chatbot')}
          className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors"
          style={
            activeTab === 'chatbot'
              ? { backgroundColor: '#00C2A8', color: '#ffffff' }
              : { backgroundColor: 'rgba(255,255,255,0.08)', color: '#94a3b8' }
          }
        >
          Chatbot
        </button>
      </nav>

      {/* Main view — only one tab rendered at a time */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === 'whatsapp' ? (
          <Dashboard onSignOut={signOut} />
        ) : (
          <ChatbotScreen onSignOut={signOut} />
        )}
      </div>
    </div>
  )
}

export default App
