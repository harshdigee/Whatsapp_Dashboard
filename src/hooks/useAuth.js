import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = not checked yet
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Multi-email: comma-separated list in VITE_ALLOWED_EMAILS
    const allowedEmails = (import.meta.env.VITE_ALLOWED_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)

    const checkAllowed = (user) => {
      if (!user?.email) return false
      return allowedEmails.includes(user.email.toLowerCase())
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return
        setSession(session)
        setIsAllowed(checkAllowed(session?.user))
        setLoading(false)
      })
      .catch(() => {
        if (!mounted) return
        setSession(null)
        setIsAllowed(false)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      setIsAllowed(checkAllowed(session?.user))
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return { session, user: session?.user, isAllowed, loading, signOut }
}
