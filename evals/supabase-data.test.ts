import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResponseSubmit } from '@/features/qa/hooks/useResponseSubmit'
import { useSignature } from '@/features/qa/hooks/useSignature'

const {
  mockInsert,
  mockStorageUpload,
  mockGetPublicUrl,
  mockStorageFrom,
  mockFrom,
  mockGetUser,
} = vi.hoisted(() => {
  const mockInsert = vi.fn()
  const mockStorageUpload = vi.fn()
  const mockGetPublicUrl = vi.fn()
  const mockStorageFrom = vi.fn(() => ({
    upload: mockStorageUpload,
    getPublicUrl: mockGetPublicUrl,
  }))
  const mockFrom = vi.fn(() => ({ insert: mockInsert }))
  const mockGetUser = vi.fn()
  return { mockInsert, mockStorageUpload, mockGetPublicUrl, mockStorageFrom, mockFrom, mockGetUser }
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    auth: { getUser: mockGetUser },
    storage: { from: mockStorageFrom },
  },
}))

describe('useResponseSubmit', () => {
  beforeEach(() => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    mockInsert.mockResolvedValue({ error: null })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('inserts question_id, answer_option_id, and session_id correctly', async () => {
    const { result } = renderHook(() => useResponseSubmit())
    await act(async () => {
      await result.current.submitResponse('q-1', 'a-1', undefined, 'sess-abc')
    })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        question_id: 'q-1',
        answer_option_id: 'a-1',
        session_id: 'sess-abc',
      })
    )
  })

  it('inserts free_text_note when provided', async () => {
    const { result } = renderHook(() => useResponseSubmit())
    await act(async () => {
      await result.current.submitResponse('q-1', 'a-1', 'my note', 'sess-abc')
    })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ free_text_note: 'my note' })
    )
  })

  it('sets free_text_note to null when omitted', async () => {
    const { result } = renderHook(() => useResponseSubmit())
    await act(async () => {
      await result.current.submitResponse('q-1', 'a-1', undefined, 'sess-abc')
    })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ free_text_note: null })
    )
  })

  it('sets user_id to null when no auth user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const { result } = renderHook(() => useResponseSubmit())
    await act(async () => {
      await result.current.submitResponse('q-1', 'a-1', undefined, 'sess-abc')
    })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: null })
    )
  })
})

describe('useSignature', () => {
  beforeEach(() => {
    mockStorageUpload.mockResolvedValue({ error: null })
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://storage.example.com/sig.png' } })
    mockInsert.mockResolvedValue({ error: null })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        blob: () => Promise.resolve(new Blob(['fake-png'], { type: 'image/png' })),
      })
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('uploads PNG to the signatures bucket under {sessionId}/{timestamp}.png', async () => {
    const { result } = renderHook(() => useSignature())
    await act(async () => {
      await result.current.save({
        sessionId: 'sess-xyz',
        signedName: 'Jane Smith',
        signatureDataUrl: 'data:image/png;base64,abc',
      })
    })
    expect(mockStorageFrom).toHaveBeenCalledWith('signatures')
    expect(mockStorageUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^sess-xyz\/\d+\.png$/),
      expect.any(Blob),
      { contentType: 'image/png', upsert: false }
    )
  })

  it('inserts session_id, signed_name, signature_url, and signed_at into signatures table', async () => {
    const { result } = renderHook(() => useSignature())
    await act(async () => {
      await result.current.save({
        sessionId: 'sess-xyz',
        signedName: 'Jane Smith',
        signatureDataUrl: 'data:image/png;base64,abc',
      })
    })
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        session_id: 'sess-xyz',
        signed_name: 'Jane Smith',
        signature_url: 'https://storage.example.com/sig.png',
        signed_at: expect.any(String),
      })
    )
  })

  it('returns null (not throws) if storage upload fails', async () => {
    mockStorageUpload.mockResolvedValue({ error: { message: 'Upload failed', name: 'StorageError' } })
    const { result } = renderHook(() => useSignature())
    let value: { signatureUrl: string } | null | undefined
    await act(async () => {
      value = await result.current.save({
        sessionId: 'sess-xyz',
        signedName: 'Jane Smith',
        signatureDataUrl: 'data:image/png;base64,abc',
      })
    })
    expect(value).toBeNull()
    expect(mockInsert).not.toHaveBeenCalled()
  })
})
