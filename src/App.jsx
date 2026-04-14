import { useAuth } from './hooks/useAuth'
import AccessDenied from './pages/AccessDenied.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
        aria-hidden
      />
    </div>
  )
}

function App() {
  const { session, user, isAllowed, loading, signOut } = useAuth()

  if (loading) return <Spinner />

  if (!session) return <LoginPage />

  if (!isAllowed) {
    return (
      <AccessDenied email={user?.email} onSignOut={signOut} />
    )
  }

  return <Dashboard onSignOut={signOut} />
}

export default App
