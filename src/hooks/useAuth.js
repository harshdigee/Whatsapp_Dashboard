import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAllowed = useCallback(async (email) => {
    if (!email) {
      setIsAllowed(false)
      return
    }
    const { data, error } = await supabase
      .from('allowed_users')
      .select('email')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('allowed_users check:', error)
    }
    setIsAllowed(Boolean(data && !error))
  }, [])

  useEffect(() => {
    let cancelled = false

    const syncAuth = async (nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user?.email) {
        await checkAllowed(nextSession.user.email)
      } else {
        setIsAllowed(false)
      }
      if (!cancelled) setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session: initial } }) => {
      if (cancelled) return
      syncAuth(initial)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (cancelled) return
      setLoading(true)
      await syncAuth(nextSession)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [checkAllowed])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { session, user, isAllowed, loading, signOut }
}
