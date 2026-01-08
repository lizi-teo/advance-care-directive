'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

interface TellMeMoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionText: string
  tellMeMoreContent: string | null
}

export function TellMeMoreModal({
  open,
  onOpenChange,
  questionText,
  tellMeMoreContent,
}: TellMeMoreModalProps) {
  if (!tellMeMoreContent) return null

  // Parse content and convert to formatted HTML with bullet points
  const formatContent = (content: string) => {
    const sections = content.split('\n\n')

    return sections.map((section, index) => {
      const lines = section.split('\n').map(line => line.trim()).filter(Boolean)

      // Check if this section has bullet points (•, -, or *)
      const hasBullets = lines.some(line =>
        line.startsWith('• ') ||
        line.startsWith('- ') ||
        line.startsWith('* ')
      )

      if (hasBullets) {
        const introLines: string[] = []
        const bulletLines: string[] = []

        lines.forEach(line => {
          // Check for bullet markers
          if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
            bulletLines.push(line.substring(2).trim())
          } else {
            introLines.push(line)
          }
        })

        return (
          <div key={index} className="mb-5 last:mb-0">
            {introLines.length > 0 && (
              <p className="mb-3">{introLines.join(' ')}</p>
            )}
            {bulletLines.length > 0 && (
              <ul className="list-disc pl-6 md:pl-8 space-y-2 marker:text-foreground/70">
                {bulletLines.map((bullet, i) => (
                  <li key={i} className="pl-2">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      }

      // Regular paragraph - join all lines into one paragraph
      return (
        <p key={index} className="mb-5 last:mb-0">
          {lines.join(' ')}
        </p>
      )
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-full h-full md:max-w-2xl md:h-[85vh] md:max-h-[800px] lg:max-w-3xl',
          'flex flex-col items-stretch p-0 border-none bg-background',
          'md:rounded-lg overflow-hidden'
        )}
        aria-label="Tell me more"
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Tell me more</DialogTitle>

        {/* Custom Header - Responsive padding */}
        <div className="flex items-center justify-between bg-muted h-14 md:h-16 px-5 md:px-6 lg:px-8 shrink-0">
          <div className="flex items-center gap-2">
            <Info size={20} className="md:hidden text-foreground" />
            <Info size={24} className="hidden md:block text-foreground" />
            <p className="text-base md:text-lg text-foreground font-[family-name:var(--font-family-body)]">
              Tell me more
            </p>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost-subtle"
              size="icon"
              className="h-auto w-auto p-0"
              aria-label="Close"
            >
              <X size={32} strokeWidth={ICON_STROKE_WIDTH} />
            </Button>
          </DialogClose>
        </div>

        {/* Content - Responsive padding and spacing */}
        <div className="flex-1 flex flex-col p-5 md:p-6 lg:p-8 overflow-y-auto">
          <div className="flex flex-col gap-6 md:gap-8">
            <h1 className="font-[family-name:var(--font-family-display)] text-lg font-medium leading-[30px] text-foreground">
              &ldquo;{questionText}&rdquo;
            </h1>
            <div className="font-[family-name:var(--font-family-body)] md:font-[family-name:var(--font-family-display)] text-base md:text-lg leading-6 md:leading-[30px] text-foreground">
              {formatContent(tellMeMoreContent)}
            </div>
          </div>
        </div>

        {/* Footer with OK Button - Responsive padding and height */}
        <div className="border-t border-border p-5 md:p-8 shrink-0 flex md:justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full md:w-auto md:min-w-[120px] h-10 md:h-12 text-base font-semibold"
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
