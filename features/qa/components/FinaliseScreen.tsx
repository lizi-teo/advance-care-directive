'use client'

import { motion } from 'motion/react'
import { SignaturePad } from './SignaturePad'
import { Button } from '@/components/ui/button'
import { PenLine, Info } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

interface FinaliseScreenProps {
  name: string
  onNameChange: (name: string) => void
  onSignatureChange: (dataUrl: string | null) => void
  consented: boolean
  onConsentChange: (checked: boolean) => void
}

export function FinaliseScreen({
  name,
  onNameChange,
  onSignatureChange,
  consented,
  onConsentChange,
}: FinaliseScreenProps) {
  return (
    <div className="w-full">
      <div className="page-container py-8 md:py-12">

        {/* Heading */}
        <motion.div
          className="flex flex-col gap-3 mb-10 md:mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <PenLine size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-primary" />
          <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
            Sign your directive
          </h1>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] max-w-xl">
            Add your name and signature to complete your advance care directive.
          </p>
          <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] max-w-xl">
            If possible, <span className="font-semibold text-foreground">have a witness with you now</span> — they just need to watch you sign.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="flex flex-col gap-8 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut', delay: 0.1 }}
        >

          {/* Full name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="full-name"
              className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]"
            >
              Full name
            </label>
            <input
              id="full-name"
              type="text"
              value={name}
              onChange={e => onNameChange(e.target.value)}
              placeholder="Enter your full legal name"
              autoComplete="name"
              className="h-12 md:h-11 w-full rounded-lg border-2 border-border-emphasis bg-background px-4 text-foreground placeholder:text-muted-foreground [font-size:var(--text-base)] font-[family-name:var(--font-family-body)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          {/* Signature */}
          <div className="flex flex-col gap-2">
            <label className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]">
              Your signature
            </label>
            <SignaturePad onChange={onSignatureChange} />
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consented}
              onChange={e => onConsentChange(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border border-border accent-primary cursor-pointer"
            />
            <span className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] group-hover:text-foreground transition-colors">
              I confirm this signature and name represent my intentions in this advance care directive.
            </span>
          </label>

          {/* Witnessing callout */}
          <div className="flex flex-col md:flex-row gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <Info size={20} strokeWidth={ICON_STROKE_WIDTH} className="shrink-0 md:mt-1 text-muted-foreground" />
            <div className="flex flex-col gap-3">
              <h6 className="[font-size:var(--text-base)] font-semibold text-foreground font-[family-name:var(--font-family-body)]">
                About witnessing
              </h6>
              <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                NSW Health recommends having your directive witnessed by someone who can confirm you had full decision-making capacity and signed freely.
              </p>
              <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                Witnessing is not legally required in NSW, but it strengthens the validity of your directive.
              </p>
              <a
                href="https://www.health.nsw.gov.au/patients/acp/Pages/default.aspx"
                target="_blank"
                rel="noopener noreferrer"
                className="[font-size:var(--text-base)] font-medium text-link underline underline-offset-2 hover:no-underline w-fit font-[family-name:var(--font-family-body)]"
              >
                Learn more at NSW Health →
              </a>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}

export function FinaliseFooter({
  onBack,
  onSubmit,
  canSubmit,
  loading = false,
}: {
  onBack: () => void
  onSubmit: () => void
  canSubmit: boolean
  loading?: boolean
}) {
  return (
    <div className="w-full border-t border-border-emphasis py-5 shrink-0 bg-background">
      <div className="page-container flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-end">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className="w-full md:w-auto md:order-2 h-12 md:h-11"
        >
          {loading ? 'Generating…' : 'Generate my directive'}
        </Button>
        <Button
          variant="ghost"
          onClick={onBack}
          className="w-full md:w-auto md:order-1 h-12 md:h-11 text-muted-foreground"
        >
          Back
        </Button>
      </div>
    </div>
  )
}
