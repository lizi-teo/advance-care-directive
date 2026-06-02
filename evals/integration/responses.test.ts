/**
 * Integration tests for user_responses — hits real local Supabase.
 * Requires `npx supabase start` to be running before executing.
 * Run with: npx vitest run --project=integration
 */

import { createClient } from '@supabase/supabase-js'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Seed a real question + answer option so foreign keys hold
let questionId: string
let answerOptionId: string
const sessionId = `integration-test-${Date.now()}`

beforeAll(async () => {
  const { data: q } = await serviceClient
    .from('questions')
    .insert({ question_text: 'Integration test question?', display_order: 999 })
    .select('id')
    .single()
  questionId = q!.id

  const { data: a } = await serviceClient
    .from('answer_options')
    .insert({ question_id: questionId, option_text: 'Test answer', option_order: 1 })
    .select('id')
    .single()
  answerOptionId = a!.id
})

afterAll(async () => {
  // Clean up everything created by this test run
  await serviceClient.from('user_responses').delete().eq('session_id', sessionId)
  await serviceClient.from('answer_options').delete().eq('id', answerOptionId)
  await serviceClient.from('questions').delete().eq('id', questionId)
})

describe('user_responses — real database', () => {
  it('anon can insert a response', async () => {
    const { error } = await supabase.from('user_responses').insert({
      question_id: questionId,
      answer_option_id: answerOptionId,
      session_id: sessionId,
      free_text_note: null,
      user_id: null,
    })
    expect(error).toBeNull()
  })

  it('anon can read responses back by session_id', async () => {
    const { data, error } = await supabase
      .from('user_responses')
      .select('*')
      .eq('session_id', sessionId)

    expect(error).toBeNull()
    expect(data).toHaveLength(1)
    expect(data![0].answer_option_id).toBe(answerOptionId)
  })

  it('inserts free_text_note correctly', async () => {
    const noteSessionId = `${sessionId}-note`
    const { error } = await supabase.from('user_responses').insert({
      question_id: questionId,
      answer_option_id: answerOptionId,
      session_id: noteSessionId,
      free_text_note: 'My personal note',
      user_id: null,
    })
    expect(error).toBeNull()

    const { data } = await supabase
      .from('user_responses')
      .select('free_text_note')
      .eq('session_id', noteSessionId)
      .single()

    expect(data?.free_text_note).toBe('My personal note')

    await serviceClient.from('user_responses').delete().eq('session_id', noteSessionId)
  })

  it('rejects insert without a valid question_id (FK constraint)', async () => {
    const { error } = await supabase.from('user_responses').insert({
      question_id: '00000000-0000-0000-0000-000000000000',
      answer_option_id: answerOptionId,
      session_id: sessionId,
      user_id: null,
    })
    expect(error).not.toBeNull()
  })
})
