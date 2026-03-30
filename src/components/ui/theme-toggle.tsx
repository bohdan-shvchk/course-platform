'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/layout/theme-provider'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="btn btn-ghost btn-sm" aria-label="Змінити тему">
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
