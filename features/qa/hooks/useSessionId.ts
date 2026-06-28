'use client'

import { useState, useEffect } from 'react'

const SESSION_KEY = 'qa-session-id'

function generateUUID(): string {
  return crypto.randomUUID()
}

export function useSessionId(): string | null {
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = generateUUID()
      localStorage.setItem(SESSION_KEY, id)
    }
    setSessionId(id)
  }, [])

  return sessionId
}

export function resetSessionId(): string {
  const id = crypto.randomUUID()
  localStorage.setItem(SESSION_KEY, id)
  localStorage.removeItem('qa-values')
  return id
}
