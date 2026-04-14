import { supabase } from '../lib/supabase'

function ChatBubbleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 12C8 8.68629 10.6863 6 14 6H28C31.3137 6 34 8.68629 34 12V24C34 27.3137 31.3137 30 28 30H18L10 38V12Z"
        fill="#0f3460"
      />
      <path
        d="M20 18C20 14.6863 22.6863 12 26 12H34C37.3137 12 40 14.6863 40 18V32L34 26H26C22.6863 26 20 23.3137 20 20V18Z"
        fill="#16213e"
        opacity="0.95"
      />
    </svg>
  )
}

export default function LoginPage() {
  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    })
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] px-4 py-10"
    >
      <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/25 dark:border-white/10 dark:bg-[#161b22]">
        <div className="mb-6 flex justify-center">
          <ChatBubbleIcon className="h-14 w-14" />
        </div>
        <h1 className="text-center text-2xl font-bold text-[#1a1a2e] dark:text-white">
          WhatsApp Dashboard
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Sign in to access your conversations
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-slate-100 dark:hover:bg-[#30363d]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-500">
          Access restricted to authorized users only
        </p>
      </div>
    </div>
  )
}
