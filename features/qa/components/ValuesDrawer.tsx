'use client'

import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'

interface ValuesDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  words: string[]
  note?: string
}

export function ValuesDrawer({ open, onOpenChange, words, note }: ValuesDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const direction = isDesktop ? 'right' : 'bottom'

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent className={isDesktop ? 'h-full flex flex-col' : 'flex flex-col'}>
        <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-6 md:pt-10 pb-4">
          <DrawerHeader className="px-0 pt-0 pb-4">
            <DrawerTitle className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)] font-normal">
              What matters most to me
            </DrawerTitle>
          </DrawerHeader>

          <p className="[font-size:var(--text-xl)] font-[family-name:var(--font-family-display)] text-foreground leading-snug">
            {words.join(' · ')}
          </p>

          {note && (
            <p className="mt-4 [font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] italic">
              &ldquo;{note}&rdquo;
            </p>
          )}
        </div>

        <div className="shrink-0 border-t border-border px-6 md:px-8 py-4">
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full h-12">
              Close
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export function ValuesDrawerTrigger({
  onClick,
  className,
}: {
  onClick: () => void
  className?: string
}) {
  return (
    <Button
      variant="ghost-subtle"
      size="icon"
      onClick={onClick}
      className={`w-8 h-8 p-0 md:w-auto md:h-auto md:px-2 md:gap-1.5 ${className ?? ''}`}
      aria-label="View your values"
    >
      <Heart size={24} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground md:hidden" />
      <Heart size={20} strokeWidth={ICON_STROKE_WIDTH} className="text-foreground hidden md:block" />
      <span className="hidden md:inline text-sm font-[family-name:var(--font-family-body)]">My values</span>
    </Button>
  )
}
