/**
 * Integration tests for values tables — hits real local Supabase.
 * Requires `npx supabase start` and migrations applied before executing.
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

const sessionId = `values-test-${Date.now()}`

afterAll(async () => {
  await serviceClient.from('session_values').delete().eq('session_id', sessionId)
})

describe('values_categories — real database', () => {
  it('anon can read categories ordered by display_order', async () => {
    const { data, error } = await supabase
      .from('values_categories')
      .select('id, name, prompt_text, display_order')
      .order('display_order')

    expect(error).toBeNull()
    expect(data).not.toBeNull()
    expect(data!.length).toBeGreaterThan(0)
    // Verify expected categories exist
    const names = data!.map(c => c.name)
    expect(names).toContain('Connection')
    expect(names).toContain('Who I am')
    expect(names).toContain('How I live')
    expect(names).not.toContain('What I stand for')
    expect(names).not.toContain('What sustains me')
    expect(data!.length).toBe(3)
    // Verify ordering
    expect(data![0].name).toBe('Connection')
  })

  it('each category has a non-empty prompt_text', async () => {
    const { data } = await supabase
      .from('values_categories')
      .select('name, prompt_text')

    for (const cat of data ?? []) {
      expect(cat.prompt_text).toBeTruthy()
    }
  })
})

describe('values_words — real database', () => {
  it('anon can read words joined to their category', async () => {
    const { data, error } = await supabase
      .from('values_words')
      .select('word, display_order, values_categories(name)')
      .order('display_order')

    expect(error).toBeNull()
    expect(data).not.toBeNull()
    expect(data!.length).toBeGreaterThan(0)
  })

  it('Connection category contains expected words', async () => {
    const { data: cat } = await supabase
      .from('values_categories')
      .select('id')
      .eq('name', 'Connection')
      .single()

    const { data: words } = await supabase
      .from('values_words')
      .select('word')
      .eq('category_id', cat!.id)
      .order('display_order')

    const wordList = words!.map(w => w.word)
    expect(wordList).toContain('Belonging')
    expect(wordList).toContain('Family')
    expect(wordList).toContain('Friendship')
    // Moved in from the old "What sustains me" category
    expect(wordList).toContain('Community')
    expect(wordList).toContain('Helping others')
    // Duplicate of "Togetherness", removed
    expect(wordList).not.toContain('Together')
  })

  it('anon cannot insert into values_words', async () => {
    const { data: cat } = await supabase
      .from('values_categories')
      .select('id')
      .limit(1)
      .single()

    const { error } = await supabase
      .from('values_words')
      .insert({ category_id: cat!.id, word: 'Hacking', display_order: 99 })

    expect(error).not.toBeNull()
  })
})

describe('session_values — real database', () => {
  const byCategory = [
    { category: 'Connection', words: ['Belonging', 'Family'] },
    { category: 'Who I am', words: ['Courage'] },
  ]

  it('anon can insert with selected_by_category', async () => {
    const { error } = await supabase.from('session_values').insert({
      session_id: sessionId,
      selected_words: ['Belonging', 'Family', 'Courage'],
      selected_by_category: byCategory,
      values_note: 'Test note',
    })
    expect(error).toBeNull()
  })

  it('anon can read selected_by_category back by session_id', async () => {
    const { data, error } = await supabase
      .from('session_values')
      .select('selected_words, selected_by_category, values_note')
      .eq('session_id', sessionId)
      .maybeSingle()

    expect(error).toBeNull()
    expect(data).not.toBeNull()
    expect(data!.selected_words).toEqual(['Belonging', 'Family', 'Courage'])
    expect(data!.selected_by_category).toEqual(byCategory)
    expect(data!.values_note).toBe('Test note')
  })

  it('selected_by_category preserves category grouping', async () => {
    const { data } = await supabase
      .from('session_values')
      .select('selected_by_category')
      .eq('session_id', sessionId)
      .maybeSingle()

    const cats = data!.selected_by_category as typeof byCategory
    const connection = cats.find(c => c.category === 'Connection')
    expect(connection?.words).toEqual(['Belonging', 'Family'])
  })
})
