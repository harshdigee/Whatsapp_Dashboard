import { useEffect } from 'react'
import useChatStore from '../store/chatStore'

export default function ThemeToggle() {
  const theme = useChatStore((s) => s.theme)
  const setTheme = useChatStore((s) => s.setTheme)

  // Apply Tailwind dark class based on theme from Zustand.
  // Persistence is already handled by the store middleware.
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <span className="text-lg leading-none">☾</span>
      ) : (
        <span className="text-lg leading-none">☀︎</span>
      )}
    </button>
  )
}


