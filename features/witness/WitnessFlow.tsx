'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import { SignaturePad } from '@/features/qa/components/SignaturePad'
import { InfoBox } from '@/components/ui/info-box'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { toast } from 'sonner'

type Step = 'prompt' | 'form'

interface WitnessFlowProps {
  sessionId: string
  signerName: string
  onDone: (witness?: { name: string; signatureUrl: string }) => void
}

export function WitnessFlow({ sessionId, signerName, onDone }: WitnessFlowProps) {
  const [step, setStep] = useState<Step>('prompt')
  const [witnessName, setWitnessName] = useState('')
  const [witnessSignature, setWitnessSignature] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = witnessName.trim().length > 0 && witnessSignature !== null
  const firstName = signerName.split(' ')[0]

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

      const { data: urlData } = supabase.storage.from('signatures').getPublicUrl(filename)

      const { error: insertError } = await supabase.from('witness_signatures').insert({
        session_id: sessionId,
        witness_name: witnessName.trim(),
        witness_signature_url: urlData.publicUrl,
        witnessed_at: new Date().toISOString(),
      })

      if (insertError) throw insertError

      onDone({ name: witnessName.trim(), signatureUrl: urlData.publicUrl })
    } catch (err) {
      console.error('[witness] failed:', err)
      toast.error('Could not save witness signature. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === 'prompt' ? (
        <motion.div
          key="prompt"
          className="absolute inset-0 flex flex-col items-center justify-center page-container"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-8 max-w-sm w-full">
            <div className="flex flex-col gap-3">
              <CheckCircle2 size={40} strokeWidth={ICON_STROKE_WIDTH} className="text-primary" />
              <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
                Directive signed
              </h1>
              <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                Is a witness with you right now?
              </p>
              <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                A witness confirms they saw {firstName} sign freely. Optional, but recommended by NSW Health.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                onClick={() => setStep('form')}
                className="w-full h-14 [font-size:var(--text-base)]"
              >
                Yes — add witness signature
              </Button>
              <button
                onClick={onDone}
                className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] text-center py-2"
              >
                No witness — view my directive
              </button>
              <p className="[font-size:var(--text-xs)] text-muted-foreground font-[family-name:var(--font-family-body)] text-center pt-1">
                Either way, you'll be able to download and print your directive next.
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          className="absolute inset-0 overflow-y-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="page-container py-10 md:py-16">
            <div className="max-w-xl flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
                  Witness signing
                </p>
                <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
                  Witness this directive
                </h1>
                <p className="[font-size:var(--text-base)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
                  You just witnessed{' '}
                  <span className="text-foreground font-medium">{signerName}</span>{' '}
                  sign their advance care directive. Please add your details below to confirm.
                </p>
              </div>

              <InfoBox className="flex flex-col gap-3">
                <p className="font-medium text-foreground">By signing, you confirm that:</p>
                <ul className="flex flex-col gap-2">
                  {[
                    `${signerName} appeared to have full decision-making capacity`,
                    'They signed freely, without pressure or coercion from anyone',
                    'You are not named in the directive as a substitute decision-maker',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </InfoBox>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="witness-name"
                  className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]"
                >
                  Witness full name
                </label>
                <input
                  id="witness-name"
                  type="text"
                  value={witnessName}
                  onChange={e => setWitnessName(e.target.value)}
                  placeholder="Enter full legal name"
                  autoComplete="name"
                  className="h-12 md:h-11 w-full rounded-lg border-2 border-border-emphasis bg-background px-4 text-foreground placeholder:text-muted-foreground [font-size:var(--text-base)] font-[family-name:var(--font-family-body)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="[font-size:var(--text-sm)] font-medium text-foreground font-[family-name:var(--font-family-body)]">
                  Witness signature
                </label>
                <SignaturePad onChange={setWitnessSignature} />
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full h-12 md:h-11"
                >
                  {submitting ? 'Saving…' : 'Confirm as witness'}
                </Button>
                <button
                  onClick={() => setStep('prompt')}
                  className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] text-center py-2"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
