import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isEmailAllowed, parseAllowedEmails } from '../lib/allowedEmails'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = not checked yet
  const [isAllowed, setIsAllowed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let warnedEmpty = false

    const raw = import.meta.env.VITE_ALLOWED_EMAILS ?? ''
    const allowedEmails = parseAllowedEmails(raw)

    if (import.meta.env.DEV && raw === '') {
      console.warn(
        '[auth] VITE_ALLOWED_EMAILS is not set. Add it to .env.local (comma-separated emails).'
      )
    }

    const checkAllowed = (user) => {
      if (!user?.email) return false
      if (allowedEmails.length === 0 && import.meta.env.PROD && !warnedEmpty) {
        warnedEmpty = true
        console.warn(
          '[auth] Allowlist is empty in this build. Set VITE_ALLOWED_EMAILS in Vercel Project → Environment Variables for Production (and Preview if you use preview URLs), then redeploy. Railway ALLOWED_EMAILS does not apply to the browser bundle.'
        )
      }
      return isEmailAllowed(user.email, allowedEmails)
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
