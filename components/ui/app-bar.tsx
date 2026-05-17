'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flower2, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useTheme } from 'next-themes'

interface AppBarProps {
  actions?: React.ReactNode
}

export function AppBar({ actions }: AppBarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="w-full h-14 border-b border-border shrink-0 sticky top-0 z-50 bg-muted">
      <div className="w-full max-w-[1440px] mx-auto h-full px-6 md:px-16 lg:px-32 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground hover:opacity-70 transition-opacity"
          aria-label="My Care Wishes — go to home"
        >
          <Flower2 size={20} strokeWidth={1.25} />
          <span className="text-sm font-[family-name:var(--font-family-body)]">My Care Wishes</span>
        </Link>
        <div className="flex items-center gap-1">
          {actions}
          <Button
            variant="ghost-subtle"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 p-0 md:w-auto md:h-auto md:px-2 md:gap-1.5"
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === 'dark' ? (
              <>
                <Sun size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
                <Sun size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
              </>
            ) : (
              <>
                <Moon size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
                <Moon size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
              </>
            )}
            {mounted && (
              <span className="hidden md:inline text-sm font-[family-name:var(--font-family-body)]">
                {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
