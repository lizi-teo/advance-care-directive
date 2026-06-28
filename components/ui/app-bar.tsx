'use client'

import React from 'react'
import Link from 'next/link'
import { Flower2 } from 'lucide-react'

interface AppBarProps {
  actions?: React.ReactNode
}

export function AppBar({ actions }: AppBarProps) {
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
        {actions && (
          <div className="flex items-center gap-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
