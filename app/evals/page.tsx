'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AssertionResult {
  ancestorTitles: string[]
  title: string
  fullName: string
  status: 'passed' | 'failed' | 'pending' | 'skipped'
  duration: number | null
  failureMessages: string[]
}

interface TestSuiteResult {
  testFilePath: string
  status: 'passed' | 'failed'
  message: string
  startTime: number
  endTime: number
  assertionResults: AssertionResult[]
}

interface VitestJsonResult {
  success: boolean
  numPassedTests: number
  numFailedTests: number
  numPendingTests: number
  testResults: TestSuiteResult[]
}

function shortPath(filePath: string) {
  const idx = filePath.indexOf('evals/')
  return idx >= 0 ? filePath.slice(idx) : filePath
}

function StatusBadge({ status }: { status: 'passed' | 'failed' | 'pending' | 'skipped' }) {
  const map = {
    passed: 'bg-green-500/15 text-green-700 dark:text-green-400',
    failed: 'bg-destructive/15 text-destructive',
    pending: 'bg-muted text-muted-foreground',
    skipped: 'bg-muted text-muted-foreground',
  }
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold font-[family-name:var(--font-family-body)] uppercase tracking-wide ${map[status]}`}
    >
      {status}
    </span>
  )
}

export default function EvalsPage() {
  const [results, setResults] = useState<VitestJsonResult | null>(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)

  const run = async () => {
    setRunning(true)
    setRunError(null)
    setResults(null)
    try {
      const res = await fetch('/api/run-evals')
      const json = await res.json()
      if (!res.ok) {
        setRunError(json.error ?? 'Unknown error')
      } else {
        setResults(json as VitestJsonResult)
      }
    } catch {
      setRunError('Could not reach /api/run-evals')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10 max-w-3xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
              Evals
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
              Unit tests for critical data paths
            </p>
          </div>
          <Button onClick={run} disabled={running} size="lg">
            {running ? 'Running…' : 'Run tests'}
          </Button>
        </div>

        {/* Error */}
        {runError && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive font-[family-name:var(--font-family-body)]">{runError}</p>
          </div>
        )}

        {/* Summary bar */}
        {results && (
          <div className="mb-6 flex items-center gap-4 rounded-lg border border-border bg-muted px-4 py-3">
            <span
              className={`text-sm font-semibold font-[family-name:var(--font-family-body)] ${
                results.success ? 'text-green-700 dark:text-green-400' : 'text-destructive'
              }`}
            >
              {results.success ? 'All tests passed' : 'Some tests failed'}
            </span>
            <span className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
              {results.numPassedTests} passed
            </span>
            {results.numFailedTests > 0 && (
              <span className="text-sm text-destructive font-[family-name:var(--font-family-body)]">
                {results.numFailedTests} failed
              </span>
            )}
          </div>
        )}

        {/* Test suites */}
        {results?.testResults.map((suite) => (
          <div key={suite.testFilePath} className="mb-6 rounded-lg border border-border overflow-hidden">
            {/* Suite header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted border-b border-border">
              <StatusBadge status={suite.status} />
              <span className="text-sm font-medium text-foreground font-[family-name:var(--font-family-body)]">
                {shortPath(suite.testFilePath)}
              </span>
            </div>

            {/* Individual tests */}
            <ul className="divide-y divide-border">
              {suite.assertionResults.map((assertion, i) => (
                <li key={i} className="px-4 py-3 flex flex-col gap-1">
                  <div className="flex items-start gap-3">
                    <StatusBadge status={assertion.status} />
                    <span className="text-sm text-foreground font-[family-name:var(--font-family-body)] flex-1">
                      {assertion.ancestorTitles.length > 0
                        ? `${assertion.ancestorTitles.join(' › ')} › ${assertion.title}`
                        : assertion.title}
                    </span>
                    {assertion.duration !== null && (
                      <span className="text-xs text-muted-foreground font-[family-name:var(--font-family-body)] shrink-0">
                        {assertion.duration}ms
                      </span>
                    )}
                  </div>
                  {assertion.failureMessages.map((msg, j) => (
                    <pre
                      key={j}
                      className="mt-1 text-xs text-destructive bg-destructive/5 rounded p-2 overflow-x-auto whitespace-pre-wrap"
                    >
                      {msg}
                    </pre>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Empty state */}
        {!results && !running && !runError && (
          <div className="rounded-lg border border-border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
              Press &ldquo;Run tests&rdquo; to execute the eval suite
            </p>
          </div>
        )}

        {running && (
          <div className="rounded-lg border border-border border-dashed px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
              Running tests…
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
