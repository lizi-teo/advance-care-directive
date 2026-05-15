'use client'

import * as React from 'react'
import { useSettings, type FontSize } from '@/lib/contexts/SettingsContext'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

interface SettingsPanelProps {
  children: React.ReactNode
}

function SettingsContent() {
  const { fontSize, setFontSize } = useSettings()

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'A⁻' },
    { value: 'medium', label: 'A' },
    { value: 'large', label: 'A⁺' },
  ]

  return (
    <div className="w-full p-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Text size</h3>
        <div className="grid grid-cols-3 gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size.value}
              variant="outline"
              onClick={() => setFontSize(size.value)}
              className={`h-12 rounded-lg font-[family-name:var(--font-family-display)] text-lg ${
                fontSize === size.value
                  ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                  : 'hover:border-primary/50'
              }`}
            >
              {size.label}
            </Button>
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
