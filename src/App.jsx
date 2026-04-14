import FullPageSpinner from './components/FullPageSpinner.jsx'
import { useAuth } from './hooks/useAuth'
import AccessDenied from './pages/AccessDenied.jsx'
import Dashboard from './pages/Dashboard.jsx'
import LoginPage from './pages/LoginPage.jsx'

function App() {
  const { session, user, isAllowed, loading, signOut } = useAuth()

  if (loading) return <FullPageSpinner />

  if (!session) return <LoginPage />

  if (!isAllowed) return <AccessDenied user={user} />

  return <Dashboard onSignOut={signOut} />
}

export default App
