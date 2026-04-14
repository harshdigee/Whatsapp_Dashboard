import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-bold text-white shadow-lg shadow-brand-500/25">
            WA
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            WhatsApp AI Dashboard
          </h1>
          <p className="text-sm text-slate-400">Sign in to continue</p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-2xl border border-slate-700 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
        >
          Sign in with Google
        </button>

        <p className="text-xs text-slate-500">
          Access restricted to authorized users only
        </p>
      </div>
    </div>
  )
}
