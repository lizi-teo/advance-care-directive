import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'

export interface ACDDocumentProps {
  answers: Array<{
    caption: string | null
    question: string
    answer: string
    note?: string
  }>
  signedName: string
  signatureDataUrl: string
  signedAt: string
  witnessName?: string
  witnessSignatureUrl?: string
  selectedValues?: string[]
  valuesNote?: string
}

const c = {
  black: '#111827',
  dark: '#1f2937',
  mid: '#6b7280',
  light: '#9ca3af',
  xlight: '#d1d5db',
  border: '#e5e7eb',
  bg: '#f9fafb',
  white: '#ffffff',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 52,
    paddingBottom: 64,
    paddingLeft: 52,
    paddingRight: 52,
    fontFamily: 'Helvetica',
    backgroundColor: c.white,
  },
  docTitle: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 6,
  },
  docSubtitle: {
    fontSize: 8,
    color: c.light,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    marginTop: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.light,
    marginBottom: 4,
  },
  personName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 14,
  },
  dateValue: {
    fontSize: 10,
    color: c.dark,
  },
  sectionHeader: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: c.light,
    marginBottom: 8,
  },
  valuesWords: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  valuesNote: {
    fontSize: 9,
    color: c.mid,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  answerRow: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  answerCaption: {
    fontSize: 7,
    color: c.xlight,
    marginBottom: 3,
  },
  answerQuestion: {
    fontSize: 9,
    color: c.mid,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  answerText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    lineHeight: 1.4,
  },
  answerNote: {
    fontSize: 8,
    color: c.mid,
    lineHeight: 1.4,
    marginTop: 3,
  },
  signatureSection: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 24,
  },
  signatureCol: {
    flex: 1,
  },
  sigImgWrapper: {
    width: 180,
    height: 80,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.bg,
    marginTop: 6,
    marginBottom: 8,
  },
  sigImg: {
    width: 180,
    height: 80,
    objectFit: 'contain' as const,
  },
  signedName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: c.black,
    marginBottom: 4,
  },
  signatureNote: {
    fontSize: 8,
    color: c.light,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 52,
    right: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: c.xlight,
  },
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ACDDocument({ answers, signedName, signatureDataUrl, signedAt, witnessName, witnessSignatureUrl, selectedValues, valuesNote }: ACDDocumentProps) {
  return (
    <Document title="Advance Care Directive" author={signedName}>
      <Page size="A4" style={styles.page}>

        <Text style={styles.docTitle}>Advance Care Directive</Text>
        <Text style={styles.docSubtitle}>New South Wales, Australia</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>PREPARED BY</Text>
        <Text style={styles.personName}>{signedName}</Text>
        <Text style={styles.label}>SIGNED ON</Text>
        <Text style={styles.dateValue}>{formatDate(signedAt)}</Text>

        <View style={styles.divider} />

        {selectedValues && selectedValues.length > 0 ? (
          <>
            <Text style={styles.sectionHeader}>WHAT MATTERS MOST TO ME</Text>
            <Text style={styles.valuesWords}>{selectedValues.join(' · ')}</Text>
            {valuesNote ? (
              <Text style={styles.valuesNote}>&ldquo;{valuesNote}&rdquo;</Text>
            ) : null}
            <View style={styles.divider} />
          </>
        ) : null}

        <Text style={styles.sectionHeader}>MY WISHES AND PREFERENCES</Text>
        {answers.map((item, i) => (
          <View key={i} style={styles.answerRow}>
            {item.caption ? (
              <Text style={styles.answerCaption}>{item.caption.toUpperCase()}</Text>
            ) : null}
            <Text style={styles.answerQuestion}>{item.question}</Text>
            <Text style={styles.answerText}>{item.answer}</Text>
            {item.note ? (
              <Text style={styles.answerNote}>Note: {item.note}</Text>
            ) : null}
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.signatureSection}>
          <View style={styles.signatureCol}>
            <Text style={styles.label}>SIGNED BY</Text>
            <View style={styles.sigImgWrapper}>
              <Image src={signatureDataUrl} style={styles.sigImg} />
            </View>
            <Text style={styles.signedName}>{signedName}</Text>
            <Text style={styles.signatureNote}>
              I confirm this signature and name represent my intentions in this advance care directive.
            </Text>
          </View>
          {witnessName && witnessSignatureUrl ? (
            <View style={styles.signatureCol}>
              <Text style={styles.label}>WITNESSED BY</Text>
              <View style={styles.sigImgWrapper}>
                <Image src={witnessSignatureUrl} style={styles.sigImg} />
              </View>
              <Text style={styles.signedName}>{witnessName}</Text>
              <Text style={styles.signatureNote}>
                Witnessed in accordance with NSW Health guidelines.
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Advance Care Directive — {signedName}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </View>

      </Page>
    </Document>
  )
}
