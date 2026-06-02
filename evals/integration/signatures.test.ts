/**
 * Integration tests for signatures — hits real local Supabase + storage.
 * Requires `npx supabase start` to be running before executing.
 * Run with: npx vitest run --project=integration
 */

import { createClient } from '@supabase/supabase-js'
import { afterAll, describe, expect, it } from 'vitest'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sessionId = `sig-test-${Date.now()}`
const uploadPath = `${sessionId}/${Date.now()}.png`
const fakeImageBuffer = Buffer.from('fake-png-data')

afterAll(async () => {
  await serviceClient.storage.from('signatures').remove([uploadPath])
  await serviceClient.from('signatures').delete().eq('session_id', sessionId)
})

describe('signatures — real database + storage', () => {
  it('anon can upload a file to the signatures bucket', async () => {
    const { error } = await supabase.storage
      .from('signatures')
      .upload(uploadPath, fakeImageBuffer, { contentType: 'image/png', upsert: false })

    expect(error).toBeNull()
  })

  it('uploaded file has a public URL', () => {
    const { data } = supabase.storage.from('signatures').getPublicUrl(uploadPath)
    expect(data.publicUrl).toContain('signatures')
    expect(data.publicUrl).toContain(uploadPath)
  })

  it('anon can insert into the signatures table', async () => {
    const { data } = supabase.storage.from('signatures').getPublicUrl(uploadPath)

    const { error } = await supabase.from('signatures').insert({
      session_id: sessionId,
      signed_name: 'Jane Smith',
      signature_url: data.publicUrl,
      signed_at: new Date().toISOString(),
    })

    expect(error).toBeNull()
  })

  it('anon can read the signature back by session_id', async () => {
    const { data, error } = await supabase
      .from('signatures')
      .select('signed_name, signature_url')
      .eq('session_id', sessionId)
      .single()

    expect(error).toBeNull()
    expect(data?.signed_name).toBe('Jane Smith')
    expect(data?.signature_url).toBeTruthy()
  })
})
