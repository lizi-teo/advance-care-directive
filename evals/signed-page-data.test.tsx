import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// ---------- hoisted mocks ----------

const { mockFrom, mockChannel, mockRemoveChannel } = vi.hoisted(() => {
  const mockChannelObj = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  }
  return {
    mockFrom: vi.fn(),
    mockChannel: vi.fn(() => mockChannelObj),
    mockRemoveChannel: vi.fn(),
  }
})

// ---------- module mocks ----------

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
    channel: mockChannel,
    removeChannel: mockRemoveChannel,
  },
}))

vi.mock('next/navigation', () => ({
  useParams: vi.fn(() => ({ sessionId: 'test-session-id' })),
}))

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ resolvedTheme: 'light' })),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('motion/react', async () => {
  const { createElement, Fragment } = await import('react')
  return {
    motion: {
      div: ({
        children,
        className,
        style,
      }: {
        children?: React.ReactNode
        className?: string
        style?: React.CSSProperties
        [key: string]: unknown
      }) => createElement('div', { className, style }, children),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      createElement(Fragment, null, children),
  }
})

vi.mock('lucide-react', () => ({
  Printer: () => null,
  Share2: () => null,
}))

vi.mock('@/features/witness/WitnessMode', () => ({
  WitnessMode: ({
    sessionId,
    signerName,
  }: {
    sessionId: string
    signerName: string
    onComplete: (r: unknown) => void
  }) => (
    <div data-testid="witness-mode" data-session={sessionId} data-signer={signerName}>
      No witness yet
    </div>
  ),
}))

import SignedPage from '@/app/signed/[sessionId]/page'

// ---------- helpers ----------

interface QueryResult {
  data: unknown
  error: unknown
}

function makeChain(result: QueryResult) {
  const chain: Record<string, unknown> = {
    select: () => chain,
    eq: () => chain,
    order: () => chain,
    limit: () => chain,
    single: () => Promise.resolve(result),
    maybeSingle: () => Promise.resolve(result),
    then: (
      resolve: (v: QueryResult) => unknown,
      reject?: (e: unknown) => unknown
    ) => Promise.resolve(result).then(resolve, reject),
    catch: (reject: (e: unknown) => unknown) => Promise.resolve(result).catch(reject),
  }
  return chain
}

const sigData = {
  signed_name: 'Jane Smith',
  signature_url: 'https://storage.example.com/sig.png',
  signed_at: '2026-06-01T12:00:00.000Z',
}

const questions = [
  { id: 'q1', question_text: 'What matters most?', caption: 'VALUES', display_order: 1 },
  { id: 'q2', question_text: 'Do you want CPR?', caption: 'CARE', display_order: 2 },
]

const answerOptions = [
  { id: 'a1', question_id: 'q1', option_text: 'Family time' },
  { id: 'a2', question_id: 'q1', option_text: 'Independence' },
  { id: 'a3', question_id: 'q2', option_text: 'Yes, attempt CPR' },
]

function setupFrom({
  witnessData = null,
  responsesData = [{ question_id: 'q1', answer_option_id: 'a1', free_text_note: null, created_at: '2026-06-01T12:00:00.000Z' }],
}: {
  witnessData?: unknown
  responsesData?: unknown[]
} = {}) {
  mockFrom.mockImplementation((table: string) => {
    switch (table) {
      case 'signatures':
        return makeChain({ data: sigData, error: null })
      case 'witness_signatures':
        return makeChain({ data: witnessData, error: null })
      case 'user_responses':
        return makeChain({ data: responsesData, error: null })
      case 'questions':
        return makeChain({ data: questions, error: null })
      case 'answer_options':
        return makeChain({ data: answerOptions, error: null })
      default:
        return makeChain({ data: null, error: null })
    }
  })
}

// ---------- tests ----------

describe('SignedPage data assembly', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('loads and displays signature, questions, and answers for the session', async () => {
    setupFrom()
    render(<SignedPage />)

    // First verify the component queries all required tables
    await waitFor(() => {
      expect(mockFrom).toHaveBeenCalledWith('signatures')
      expect(mockFrom).toHaveBeenCalledWith('witness_signatures')
      expect(mockFrom).toHaveBeenCalledWith('user_responses')
      expect(mockFrom).toHaveBeenCalledWith('questions')
      expect(mockFrom).toHaveBeenCalledWith('answer_options')
    })

    // Then verify the loaded data renders
    // Note: "Jane Smith" appears in both the Full Name and Signed By sections
    await waitFor(() => {
      expect(screen.getAllByText('Jane Smith').length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText('What matters most?')).toBeInTheDocument()
      expect(screen.getByText('Family time')).toBeInTheDocument()
    })
  })

  it('deduplicates responses so only the latest per question_id is used', async () => {
    setupFrom({
      responsesData: [
        // Supabase returns DESC by created_at — first row is the latest
        { question_id: 'q1', answer_option_id: 'a2', free_text_note: null, created_at: '2026-06-01T13:00:00.000Z' },
        { question_id: 'q1', answer_option_id: 'a1', free_text_note: null, created_at: '2026-06-01T12:00:00.000Z' },
      ],
    })
    render(<SignedPage />)
    await waitFor(() => {
      expect(screen.getByText('Independence')).toBeInTheDocument()
    })
    expect(screen.queryByText('Family time')).not.toBeInTheDocument()
  })

  it('renders witness block when witness_signatures returns a record', async () => {
    setupFrom({
      witnessData: {
        witness_name: 'Dr. John Witness',
        witness_signature_url: 'https://storage.example.com/witness.png',
        witnessed_at: '2026-06-02T10:00:00.000Z',
      },
    })
    render(<SignedPage />)
    await waitFor(() => {
      expect(screen.getByText('Dr. John Witness')).toBeInTheDocument()
    })
  })

  it('renders WitnessMode when witness_signatures returns null', async () => {
    setupFrom({ witnessData: null })
    render(<SignedPage />)
    await waitFor(() => {
      expect(screen.getByTestId('witness-mode')).toBeInTheDocument()
      expect(screen.getByText('No witness yet')).toBeInTheDocument()
    })
  })

  it('shows free_text_note as a note under the answer', async () => {
    setupFrom({
      responsesData: [
        {
          question_id: 'q1',
          answer_option_id: 'a1',
          free_text_note: 'Personal preference note',
          created_at: '2026-06-01T12:00:00.000Z',
        },
      ],
    })
    render(<SignedPage />)
    await waitFor(() => {
      expect(screen.getByText(/Personal preference note/)).toBeInTheDocument()
    })
  })

  it('shows "Not answered" for questions with no matching response', async () => {
    setupFrom({
      responsesData: [
        // only q1 answered, q2 has no response
        { question_id: 'q1', answer_option_id: 'a1', free_text_note: null, created_at: '2026-06-01T12:00:00.000Z' },
      ],
    })
    render(<SignedPage />)
    await waitFor(() => {
      expect(screen.getByText('Do you want CPR?')).toBeInTheDocument()
      expect(screen.getByText('Not answered')).toBeInTheDocument()
    })
  })
})
