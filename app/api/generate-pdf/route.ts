import { NextRequest } from 'next/server'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { ACDDocument, type ACDDocumentProps } from '@/features/pdf/components/ACDDocument'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ACDDocumentProps

    if (!body.signedName || !body.signatureDataUrl || !body.signedAt || !Array.isArray(body.answers)) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(React.createElement(ACDDocument, body) as any)

    const safeName = body.signedName.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="advance-care-directive-${safeName}.pdf"`,
      },
    })
  } catch (err) {
    console.error('[generate-pdf]', err)
    return Response.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}
