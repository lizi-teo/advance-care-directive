'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { Button } from '@/components/ui/button'

/** Switches between light and dark mode. Lives in the app bar. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is only known in the browser, so wait until mounted to avoid a hydration mismatch
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'
  const Icon = isDark ? Sun : Moon
  const label = isDark ? 'Light mode' : 'Dark mode'

  return (
    <Button
      variant="ghost-subtle"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-8 h-8 p-0 md:w-auto md:h-auto md:px-2 md:gap-1.5"
      aria-label={`Switch to ${label.toLowerCase()}`}
    >
      <Icon size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
      <Icon size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
      <span className="hidden md:inline text-sm font-[family-name:var(--font-family-body)]">{label}</span>
    </Button>
  )
}
