'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useSettings, type FontSize } from '@/lib/contexts/SettingsContext'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

interface SettingsPanelProps {
  children: React.ReactNode
}

function SettingsContent() {
  const { fontSize, setFontSize } = useSettings()
  const { theme, setTheme } = useTheme()

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'A⁻' },
    { value: 'medium', label: 'A' },
    { value: 'large', label: 'A⁺' },
  ]

  const themes: { value: string; label: string }[] = [
    { value: 'system', label: 'Auto' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ]

  return (
    <div className="w-full p-6 space-y-6">
      {/* Font Size Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Font Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => setFontSize(size.value)}
              className={`h-12 rounded-lg border-2 transition-colors font-[family-name:var(--font-family-display)] text-lg ${
                fontSize === size.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/50'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Theme</h3>
        <div className="grid grid-cols-3 gap-2">
          {themes.map((themeOption) => (
            <button
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`h-12 rounded-lg border-2 transition-colors text-sm ${
                theme === themeOption.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/50'
              }`}
            >
              {themeOption.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SettingsPanel({ children }: SettingsPanelProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <SettingsContent />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only">Settings</DrawerTitle>
        <DrawerDescription className="sr-only">
          Adjust font size and theme preferences
        </DrawerDescription>
        <SettingsContent />
      </DrawerContent>
    </Drawer>
  )
}
