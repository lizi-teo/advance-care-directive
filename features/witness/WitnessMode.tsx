'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import { SignaturePad } from '@/features/qa/components/SignaturePad'
import { InfoBox } from '@/components/ui/info-box'
import { Button, OutlineButton } from '@/components/ui/button'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'
import { toast } from 'sonner'

type WitnessState = 'idle' | 'form'

export interface WitnessRecord {
  witness_name: string
  witness_signature_url: string
  witnessed_at: string
}

interface WitnessModeProps {
  sessionId: string
  signerName: string
  onComplete: (witness: WitnessRecord) => void
}

export function WitnessMode({ sessionId, signerName, onComplete }: WitnessModeProps) {
  const [state, setState] = useState<WitnessState>('idle')
  const [witnessName, setWitnessName] = useState('')
  const [witnessSignature, setWitnessSignature] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = witnessName.trim().length > 0 && witnessSignature !== null

  const handleSubmit = async () => {
    if (!witnessSignature || !witnessName.trim()) return
    setSubmitting(true)

    try {
      const blob = await fetch(witnessSignature).then(r => r.blob())
      const filename = `witnesses/${sessionId}/${Date.now()}.png`

      const { error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(filename, blob, { contentType: 'image/png', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('signatures').getPublicUrl(filename)

      const witnessed_at = new Date().toISOString()

      const { error: insertError } = await supabase.from('witness_signatures').insert({
        session_id: sessionId,
        witness_name: witnessName.trim(),
        witness_signature_url: urlData.publicUrl,
        witnessed_at,
      })

      if (insertError) throw insertError

      onComplete({
        witness_name: witnessName.trim(),
        witness_signature_url: urlData.publicUrl,
        witnessed_at,
      })
    } catch (err) {
      console.error('[witness] failed:', err)
      toast.error('Could not save witness signature. Please try again.')
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setState('idle')
    setWitnessName('')
    setWitnessSignature(null)
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === 'idle' ? (
        <motion.div
          key="idle"
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
            Witnessed by
          </p>
          <div className="h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
            <p className="[font-size:var(--text-xs)] text-muted-foreground font-[family-name:var(--font-family-body)]">
              No witness yet
            </p>
          </div>
          <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
            Optional — NSW Health recommends having a witness present who can confirm you signed freely.
          </p>
          <OutlineButton
            onClick={() => setState('form')}
            className="w-full h-12 font-[family-name:var(--font-family-body)] mt-1"
          >
            Add a witness signature
          </OutlineButton>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex flex-col gap-1">
            <p className="[font-size:var(--text-xs)] uppercase tracking-wide text-muted-foreground font-[family-name:var(--font-family-body)]">
              Witnessed by
            </p>
            <p className="[font-size:var(--text-sm)] text-muted-foreground font-[family-name:var(--font-family-body)] leading-relaxed">
              If you've read {signerName.split(' ')[0]}'s care wishes above and saw them sign, please add your name and signature below.
            </p>
          </div>

          <InfoBox className="flex flex-col gap-3 [font-size:var(--text-sm)]">
            <p className="font-medium text-foreground">By signing, you confirm that:</p>
            <ul className="flex flex-col gap-2">
              {[
                `${signerName} appeared to have full decision-making capacity at the time of signing`,
                'They signed freely, without pressure or coercion from anyone',
                'You are not named in the directive as a substitute decision-maker',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border pt-3 text-muted-foreground">
              Witnessing is not legally required in NSW but is strongly recommended by NSW Health.
            </div>
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
              onClick={handleCancel}
              className="[font-size:var(--text-sm)] text-muted-foreground hover:text-foreground transition-colors font-[family-name:var(--font-family-body)] text-center py-2"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
