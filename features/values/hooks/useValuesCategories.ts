'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface ValuesCategory {
  id: string
  name: string
  prompt_text: string
  display_order: number
  words: { id: string; word: string; display_order: number }[]
}

export function useValuesCategories() {
  const [categories, setCategories] = useState<ValuesCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: words }] = await Promise.all([
        supabase.from('values_categories').select('id, name, prompt_text, display_order').order('display_order'),
        supabase.from('values_words').select('id, category_id, word, display_order').order('display_order'),
      ])

      if (!cats) { setLoading(false); return }

      const wordsByCat = (words ?? []).reduce<Record<string, { id: string; word: string; display_order: number }[]>>(
        (acc, w) => {
          if (!acc[w.category_id]) acc[w.category_id] = []
          acc[w.category_id]!.push({ id: w.id, word: w.word, display_order: w.display_order })
          return acc
        },
        {}
      )

      setCategories(cats.map(c => ({ ...c, words: wordsByCat[c.id] ?? [] })))
      setLoading(false)
    }

    load()
  }, [])

  return { categories, loading }
}
