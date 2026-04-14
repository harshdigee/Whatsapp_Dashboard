import { supabase } from '../lib/supabase'

export default function AccessDenied({ user }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 py-10">
      <div className="w-full max-w-[400px] overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#161b22]">
        <div className="h-1.5 bg-[#ef4444]" />
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1a1a2e] dark:text-white">
            Access Denied
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            This account is not authorized to use this dashboard.
          </p>

          {user?.email && (
            <p className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 dark:border-[#30363d] dark:bg-[#21262d] dark:text-slate-200">
              <span className="text-slate-500 dark:text-slate-400">Signed in as </span>
              {user.email}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-8 w-full rounded-xl border border-slate-300 bg-transparent px-4 py-3 text-sm font-semibold text-[#1a1a2e] transition hover:bg-slate-50 dark:border-[#30363d] dark:text-slate-100 dark:hover:bg-[#21262d]"
          >
            Sign out and try another account
          </button>
        </div>
      </div>
    </div>
  )
}
