import { useEffect } from 'react'
import useChatStore from '../store/chatStore'

export default function ThemeToggle() {
  const theme = useChatStore((s) => s.theme)
  const setTheme = useChatStore((s) => s.setTheme)

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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-amber-500 shadow-sm transition hover:bg-slate-50 dark:border-[#30363d] dark:bg-[#21262d] dark:text-amber-300 dark:hover:bg-[#30363d]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <span aria-hidden>☾</span> : <span aria-hidden>☀</span>}
    </button>
  )
}
