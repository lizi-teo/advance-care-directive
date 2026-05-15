import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface SignaturePayload {
  sessionId: string
  signedName: string
  signatureDataUrl: string
}

interface UseSignatureReturn {
  saving: boolean
  save: (payload: SignaturePayload) => Promise<{ signatureUrl: string } | null>
}

export function useSignature(): UseSignatureReturn {
  const [saving, setSaving] = useState(false)

  const save = async ({ sessionId, signedName, signatureDataUrl }: SignaturePayload) => {
    setSaving(true)
    try {
      const blob = await fetch(signatureDataUrl).then(r => r.blob())
      const filename = `${sessionId}/${Date.now()}.png`

      const { error: uploadError } = await supabase.storage
        .from('signatures')
        .upload(filename, blob, { contentType: 'image/png', upsert: false })

      if (uploadError) {
        console.error('[useSignature] storage upload failed:', uploadError.message, uploadError)
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from('signatures')
        .getPublicUrl(filename)

      const signatureUrl = urlData.publicUrl

      const { error: insertError } = await supabase
        .from('signatures')
        .insert({ session_id: sessionId, signed_name: signedName, signature_url: signatureUrl, signed_at: new Date().toISOString() })

      if (insertError) {
        console.error('[useSignature] db insert failed:', insertError.message, insertError)
        throw insertError
      }

      return { signatureUrl }
    } catch (err) {
      console.error('[useSignature] failed to save:', err instanceof Error ? err.message : err)
      return null
    } finally {
      setSaving(false)
    }
  }

  return { saving, save }
}
