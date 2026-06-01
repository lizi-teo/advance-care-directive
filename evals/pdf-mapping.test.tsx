import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ACDDocument, type ACDDocumentProps } from '@/features/pdf/components/ACDDocument'

vi.mock('@react-pdf/renderer', () => ({
  Document: ({
    children,
    title,
    author,
  }: {
    children?: React.ReactNode
    title?: string
    author?: string
  }) => (
    <div data-testid="document" data-title={title} data-author={author}>
      {children}
    </div>
  ),
  Page: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Text: ({
    children,
    render: renderProp,
  }: {
    children?: React.ReactNode
    render?: (args: { pageNumber: number; totalPages: number }) => string
    style?: unknown
    fixed?: boolean
  }) => <span>{renderProp ? renderProp({ pageNumber: 1, totalPages: 1 }) : children}</span>,
  View: ({ children }: { children?: React.ReactNode; style?: unknown; fixed?: boolean }) => (
    <div>{children}</div>
  ),
  Image: ({ src }: { src: string; style?: unknown }) => <img src={src} alt="signature" data-testid="pdf-image" />,
  StyleSheet: { create: (styles: Record<string, unknown>) => styles },
}))

const baseProps: ACDDocumentProps = {
  answers: [
    { caption: 'VALUES', question: 'Question 1?', answer: 'Answer 1', note: 'My note' },
    { caption: null, question: 'Question 2?', answer: 'Answer 2' },
  ],
  signedName: 'Jane Smith',
  signatureDataUrl: 'data:image/png;base64,abc123',
  signedAt: '2026-06-01T12:00:00.000Z',
}

describe('ACDDocument', () => {
  it('renders all answers in the PDF output', () => {
    render(<ACDDocument {...baseProps} />)
    expect(screen.getByText('Question 1?')).toBeInTheDocument()
    expect(screen.getByText('Answer 1')).toBeInTheDocument()
    expect(screen.getByText('Question 2?')).toBeInTheDocument()
    expect(screen.getByText('Answer 2')).toBeInTheDocument()
  })

  it('includes free_text_note values', () => {
    render(<ACDDocument {...baseProps} />)
    expect(screen.getByText(/My note/)).toBeInTheDocument()
  })

  it('shows signedName in the signature section and footer', () => {
    render(<ACDDocument {...baseProps} />)
    const nameMatches = screen.getAllByText('Jane Smith')
    expect(nameMatches.length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/Advance Care Directive — Jane Smith/)).toBeInTheDocument()
  })

  it('passes signatureDataUrl to the Image component', () => {
    render(<ACDDocument {...baseProps} />)
    const img = screen.getByTestId('pdf-image')
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc123')
  })

  it('formats signedAt as Australian locale', () => {
    render(<ACDDocument {...baseProps} />)
    expect(screen.getByText('1 June 2026')).toBeInTheDocument()
  })

  it('renders without error when caption is null', () => {
    const nullCaptionProps: ACDDocumentProps = {
      ...baseProps,
      answers: [{ caption: null, question: 'Q?', answer: 'A' }],
    }
    expect(() => render(<ACDDocument {...nullCaptionProps} />)).not.toThrow()
    expect(screen.getByText('Q?')).toBeInTheDocument()
  })
})
