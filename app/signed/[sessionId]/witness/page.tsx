'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import { SignaturePad } from '@/features/qa/components/SignaturePad'
import { Button, OutlineButton } from '@/components/ui/button'
import { toast } from 'sonner'
import { InfoBox } from '@/components/ui/info-box'
import { Copy, Check, CheckCircle2 } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

export default function WitnessPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [signerName, setSignerName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [witnessName, setWitnessName] = useState('')
  const [witnessSignature, setWitnessSignature] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const directiveUrl = typeof window !== 'undefined' ? `${window.location.origin}/signed/${sessionId}` : ''

  useEffect(() => {
    async function check() {
      const [{ data: existing }, { data: sig }] = await Promise.all([
        supabase
          .from('witness_signatures')
          .select('id')
          .eq('session_id', sessionId)
          .maybeSingle(),
        supabase
          .from('signatures')
          .select('signed_name')
          .eq('session_id', sessionId)
          .maybeSingle(),
      ])

      if (existing) {
        router.replace(`/signed/${sessionId}`)
        return
      }

      setSignerName(sig?.signed_name ?? null)
      setLoading(false)
    }

    if (sessionId) check()
  }, [sessionId, router])

  const handleSubmit = async () => {
    if (!witnessSignature || !witnessName.trim()) return
    setSubmitting(true)

    try {
      const blob = await fetch(witnessSignature).then(r => r.blob())
      const filename = `${sessionId}/witness-${Date.now()}.png`

      const { error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(filename, blob, { contentType: 'image/png', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('signatures')
        .getPublicUrl(filename)

      const { error: insertError } = await supabase
        .from('witness_signatures')
        .insert({
          session_id: sessionId,
          witness_name: witnessName.trim(),
          witness_signature_url: urlData.publicUrl,
          witnessed_at: new Date().toISOString(),
        })

      if (insertError) throw insertError

      setDone(true)
    } catch (err) {
      console.error('[witness] failed:', err)
      toast.error('Could not save your witness signature. Please try again.')
      setSubmitting(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(directiveUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-[family-name:var(--font-family-body)]">Loading…</p>
      </div>
    )
  }

  const canSubmit = witnessName.trim().length > 0 && witnessSignature !== null
  const firstName = signerName?.split(' ')[0] ?? 'them'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="w-full border-b border-border bg-muted">
        <div className="page-container h-14 flex items-center">
          <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            NSW Advance Care Directive — Witness signature
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-10 md:py-16">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              className="max-w-xl flex flex-col gap-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <CheckCircle2 size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-primary" />
              <div className="flex flex-col gap-2">
                <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
                  Thank you, {witnessName.split(' ')[0]}
                </h1>
                <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                  You have witnessed {signerName ?? 'this person'}'s advance care directive. Your signature has been saved.
                </p>
                <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                  Share the link below so {firstName} knows their directive is now witnessed.
                </p>
              </div>

              {/* Share section */}
              <div className="flex flex-col gap-3 pt-2">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                  Share the completed directive
                </p>
                <div className="btn-group">
                  <div className="flex-1 flex items-center h-11 px-3 rounded-lg border border-border bg-muted/40 min-w-0">
                    <span className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] truncate">
                      {directiveUrl}
                    </span>
                  </div>
                  <OutlineButton
                    onClick={handleCopy}
                    icon={copied ? <Check size={15} strokeWidth={ICON_STROKE_WIDTH} /> : <Copy size={15} strokeWidth={ICON_STROKE_WIDTH} />}
                    className="h-11 shrink-0 font-[family-name:var(--font-family-body)]"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </OutlineButton>
                </div>
              </div>

              <button
                onClick={() => router.push(`/signed/${sessionId}`)}
                className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] underline underline-offset-2 text-left w-fit"
              >
                View the full directive →
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              className="max-w-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="mb-8">
                <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground mb-4">
                  Witness this directive
                </h1>
                {signerName && (
                  <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                    You have been asked to witness{' '}
                    <span className="text-foreground font-medium">{signerName}</span>'s
                    advance care directive.
                  </p>
                )}
              </div>

              {/* What witnessing means */}
              <InfoBox className="mb-10 flex flex-col gap-3">
                <p className="font-medium text-foreground">
                  By signing as a witness, you confirm that:
                </p>
                <ul className="flex flex-col gap-2">
                  {[
                    `${signerName ?? 'The person'} appeared to have full decision-making capacity at the time of signing`,
                    'They signed freely, without pressure or coercion from anyone',
                    'You are not named in the directive as a substitute decision-maker',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border pt-3">
                  Witnessing is not legally required in NSW but is strongly recommended by NSW Health to support the validity of the directive.
                </div>
              </InfoBox>

              {/* Form */}
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="witness-name"
                    className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]"
                  >
                    Your full name
                  </label>
                  <input
                    id="witness-name"
                    type="text"
                    value={witnessName}
                    onChange={e => setWitnessName(e.target.value)}
                    placeholder="Enter your full legal name"
                    autoComplete="name"
                    className="h-12 md:h-11 w-full rounded-lg border-2 border-border-emphasis bg-background px-4 text-foreground placeholder:text-muted-foreground [font-size:var(--text-base)] font-[family-name:var(--font-family-body)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]">
                    Your signature
                  </label>
                  <SignaturePad onChange={setWitnessSignature} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-10">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full h-12 md:h-11"
                >
                  {submitting ? 'Saving…' : 'Confirm as witness'}
                </Button>
                <button
                  onClick={() => router.back()}
                  className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] text-center py-2"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
