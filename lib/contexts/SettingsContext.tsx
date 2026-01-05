'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type FontSize = 'small' | 'medium' | 'large'

interface SettingsContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const FONT_SIZE_KEY = 'user-font-size-preference'

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load font size from localStorage
    const stored = localStorage.getItem(FONT_SIZE_KEY)
    if (stored === 'small' || stored === 'medium' || stored === 'large') {
      setFontSizeState(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Apply font size to document root
    const root = document.documentElement

    // Remove all font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')

    // Add current font size class
    root.classList.add(`font-size-${fontSize}`)

    // Save to localStorage
    localStorage.setItem(FONT_SIZE_KEY, fontSize)
  }, [fontSize, mounted])

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
  }

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
