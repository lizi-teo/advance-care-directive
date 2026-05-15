'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import SignaturePadLib from 'signature_pad'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void
}

export function SignaturePad({ onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePadLib | null>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const bgColor = mounted && resolvedTheme === 'dark' ? '#3F384F' : '#D8CDE9'

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const pad = padRef.current
    if (!canvas || !pad) return
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    const data = pad.toData()
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d')!.scale(ratio, ratio)
    pad.clear()
    pad.fromData(data)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    canvas.getContext('2d')!.scale(ratio, ratio)

    const pad = new SignaturePadLib(canvas, { backgroundColor: 'transparent' })
    padRef.current = pad

    const handleEnd = () => onChange(pad.isEmpty() ? null : pad.toDataURL())
    pad.addEventListener('endStroke', handleEnd)
    window.addEventListener('resize', resizeCanvas)

    return () => {
      pad.removeEventListener('endStroke', handleEnd)
      window.removeEventListener('resize', resizeCanvas)
      pad.off()
    }
  }, [onChange, resizeCanvas])

  const handleClear = () => {
    padRef.current?.clear()
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative border-2 border-border-emphasis rounded-lg overflow-hidden h-40 md:h-48 touch-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: bgColor }}
          aria-label="Signature pad — draw your signature here"
        />
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-foreground/60 pointer-events-none select-none font-[family-name:var(--font-family-body)] whitespace-nowrap">
          Draw your signature
        </p>
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="gap-1.5 text-muted-foreground h-8 px-2 text-xs"
        >
          <Trash2 size={14} strokeWidth={ICON_STROKE_WIDTH} />
          Clear
        </Button>
      </div>
    </div>
  )
}
