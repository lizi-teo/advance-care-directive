import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { NextRequest } from 'next/server'

const mockRenderToBuffer = vi.hoisted(() => vi.fn())

vi.mock('@react-pdf/renderer', () => ({
  renderToBuffer: mockRenderToBuffer,
  Document: () => null,
  Page: () => null,
  Text: () => null,
  View: () => null,
  Image: () => null,
  StyleSheet: { create: (s: Record<string, unknown>) => s },
}))

import { POST } from '@/app/api/generate-pdf/route'

function makeRequest(body: unknown): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest
}

const validBody = {
  signedName: 'Jane Smith',
  signatureDataUrl: 'data:image/png;base64,abc',
  signedAt: '2026-06-01T12:00:00.000Z',
  answers: [{ caption: 'VALUES', question: 'Q?', answer: 'A' }],
}

describe('POST /api/generate-pdf', () => {
  beforeEach(() => {
    mockRenderToBuffer.mockResolvedValue(Buffer.from('fake-pdf'))
  })

  it('returns 400 if signedName is missing', async () => {
    const { signedName: _, ...body } = validBody
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 if signatureDataUrl is missing', async () => {
    const { signatureDataUrl: _, ...body } = validBody
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 if signedAt is missing', async () => {
    const { signedAt: _, ...body } = validBody
    const res = await POST(makeRequest(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 if answers is not an array', async () => {
    const res = await POST(makeRequest({ ...validBody, answers: 'not-an-array' }))
    expect(res.status).toBe(400)
  })

  it('returns PDF response with correct Content-Type and Content-Disposition headers', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('application/pdf')
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="advance-care-directive-jane-smith.pdf"'
    )
  })

  it('sanitizes signedName spaces and special chars into a safe filename', async () => {
    const res = await POST(makeRequest({ ...validBody, signedName: 'Jane O\'Brien' }))
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="advance-care-directive-jane-o-brien.pdf"'
    )
  })
})
