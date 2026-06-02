'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  XCircle,
  Circle,
  MessageSquare,
  PenLine,
  FileText,
  Eye,
  Database,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import { ICON_STROKE_WIDTH } from '@/lib/theme-config'

// ---------- types ----------

interface AssertionResult {
  ancestorTitles: string[]
  title: string
  fullName: string
  status: 'passed' | 'failed' | 'pending' | 'skipped'
  duration: number | null
  failureMessages: string[]
}

interface TestSuiteResult {
  name: string
  status: 'passed' | 'failed'
  assertionResults: AssertionResult[]
}

interface VitestJsonResult {
  success: boolean
  numPassedTests: number
  numFailedTests: number
  testResults: TestSuiteResult[]
}

type Tab = 'unit' | 'integration'

// ---------- journey steps ----------

interface JourneyStep {
  id: string
  label: string
  sublabel: string
  icon: React.ReactNode
  match: (file: string, ancestors: string[]) => boolean
}

const UNIT_STEPS: JourneyStep[] = [
  {
    id: 'answer',
    label: 'Answer Questions',
    sublabel: 'Saving responses to Supabase',
    icon: <MessageSquare size={18} strokeWidth={ICON_STROKE_WIDTH} />,
    match: (file, ancestors) =>
      file.includes('supabase-data') &&
      ancestors.some(a => a.includes('useResponseSubmit')),
  },
  {
    id: 'sign',
    label: 'Sign & Witness',
    sublabel: 'Uploading signature to storage',
    icon: <PenLine size={18} strokeWidth={ICON_STROKE_WIDTH} />,
    match: (file, ancestors) =>
      file.includes('supabase-data') &&
      ancestors.some(a => a.includes('useSignature')),
  },
  {
    id: 'pdf',
    label: 'Generate PDF',
    sublabel: 'PDF route & document layout',
    icon: <FileText size={18} strokeWidth={ICON_STROKE_WIDTH} />,
    match: (file) =>
      file.includes('pdf-api') || file.includes('pdf-mapping'),
  },
  {
    id: 'view',
    label: 'View & Share',
    sublabel: 'Signed page data assembly',
    icon: <Eye size={18} strokeWidth={ICON_STROKE_WIDTH} />,
    match: (file) => file.includes('signed-page'),
  },
]

const INTEGRATION_STEPS: JourneyStep[] = [
  {
    id: 'responses',
    label: 'Save Responses',
    sublabel: 'Real DB — user_responses table',
    icon: <MessageSquare size={18} strokeWidth={ICON_STROKE_WIDTH} />,
    match: (file) => file.includes('responses'),
  },
  {
    id: 'signatures',
    label: 'Sign & Upload',
    sublabel: 'Real DB + storage bucket',
    icon: <PenLine size={18} strokeWidth={ICON_STROKE_WIDTH} />,
    match: (file) => file.includes('signatures'),
  },
]

// ---------- helpers ----------

interface FlatTest extends AssertionResult {
  file: string
}

function collectTests(step: JourneyStep, results: TestSuiteResult[]): FlatTest[] {
  const out: FlatTest[] = []
  for (const suite of results) {
    for (const a of suite.assertionResults) {
      if (step.match(suite.name, a.ancestorTitles)) {
        out.push({ ...a, file: suite.name })
      }
    }
  }
  return out
}

type StepStatus = 'pass' | 'fail' | 'idle'

function stepStatus(tests: FlatTest[]): StepStatus {
  if (tests.length === 0) return 'idle'
  return tests.every(t => t.status === 'passed') ? 'pass' : 'fail'
}

// ---------- sub-components ----------

function TestRow({ test }: { test: FlatTest }) {
  const passed = test.status === 'passed'
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-2">
        {passed ? (
          <CheckCircle2
            size={14}
            strokeWidth={ICON_STROKE_WIDTH}
            className="text-green-600 dark:text-green-400 shrink-0 mt-0.5"
          />
        ) : (
          <XCircle
            size={14}
            strokeWidth={ICON_STROKE_WIDTH}
            className="text-destructive shrink-0 mt-0.5"
          />
        )}
        <span
          className={`text-xs leading-snug font-[family-name:var(--font-family-body)] ${
            passed ? 'text-foreground/80' : 'text-destructive'
          }`}
        >
          {test.title}
        </span>
      </div>
      {test.failureMessages.length > 0 && (
        <pre className="text-[10px] text-destructive bg-destructive/5 rounded p-1.5 ml-5 overflow-x-auto whitespace-pre-wrap leading-snug">
          {test.failureMessages[0].split('\n').slice(0, 4).join('\n')}
        </pre>
      )}
    </div>
  )
}

function StepColumn({
  step,
  index,
  tests,
  status,
  isLast,
}: {
  step: JourneyStep
  index: number
  tests: FlatTest[]
  status: StepStatus
  isLast: boolean
}) {
  const passCount = tests.filter(t => t.status === 'passed').length
  const total = tests.length

  const headerClass =
    status === 'pass'
      ? 'bg-green-500/8 border-green-500/20 text-green-700 dark:text-green-400'
      : status === 'fail'
      ? 'bg-destructive/8 border-destructive/20 text-destructive'
      : 'bg-muted border-border text-muted-foreground'

  const badgeClass =
    status === 'pass'
      ? 'bg-green-500/15 text-green-700 dark:text-green-400'
      : status === 'fail'
      ? 'bg-destructive/15 text-destructive'
      : 'bg-foreground/8 text-muted-foreground'

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-start gap-0 md:gap-0 flex-1 min-w-0">
      <div className="flex-1 min-w-0 flex flex-col rounded-lg border border-border overflow-hidden">
        <div className={`border-b px-3 py-3 flex flex-col gap-1.5 ${headerClass}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="opacity-60 text-xs font-semibold font-[family-name:var(--font-family-body)]">
                {index + 1}
              </span>
              {step.icon}
              <span className="text-sm font-semibold font-[family-name:var(--font-family-body)] leading-tight">
                {step.label}
              </span>
            </div>
            {total > 0 && (
              <span
                className={`text-[11px] font-semibold font-[family-name:var(--font-family-body)] px-1.5 py-0.5 rounded ${badgeClass}`}
              >
                {passCount}/{total}
              </span>
            )}
          </div>
          <p className="text-[11px] opacity-60 font-[family-name:var(--font-family-body)] leading-none">
            {step.sublabel}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 p-3 flex-1">
          {tests.length === 0 ? (
            <div className="flex items-center gap-2 py-2">
              <Circle size={14} strokeWidth={ICON_STROKE_WIDTH} className="text-muted-foreground/40" />
              <span className="text-xs text-muted-foreground/40 font-[family-name:var(--font-family-body)]">
                No results yet
              </span>
            </div>
          ) : (
            tests.map((t, i) => <TestRow key={i} test={t} />)
          )}
        </div>
      </div>

      {!isLast && (
        <>
          <div className="hidden md:flex items-start pt-4 px-1 shrink-0 text-border">
            <ChevronRight size={16} strokeWidth={ICON_STROKE_WIDTH} />
          </div>
          <div className="flex md:hidden justify-center py-1 text-border">
            <ChevronDown size={16} strokeWidth={ICON_STROKE_WIDTH} />
          </div>
        </>
      )}
    </div>
  )
}

// ---------- page ----------

export default function EvalsPage() {
  const [tab, setTab] = useState<Tab>('unit')
  const [unitResults, setUnitResults] = useState<VitestJsonResult | null>(null)
  const [integrationResults, setIntegrationResults] = useState<VitestJsonResult | null>(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState<string | null>(null)

  const results = tab === 'unit' ? unitResults : integrationResults
  const steps = tab === 'unit' ? UNIT_STEPS : INTEGRATION_STEPS

  const run = async () => {
    setRunning(true)
    setRunError(null)
    if (tab === 'unit') setUnitResults(null)
    else setIntegrationResults(null)

    try {
      const res = await fetch(`/api/run-evals?project=${tab}`)
      const json = await res.json()
      if (!res.ok) {
        setRunError(json.error ?? 'Unknown error')
      } else {
        if (tab === 'unit') setUnitResults(json as VitestJsonResult)
        else setIntegrationResults(json as VitestJsonResult)
      }
    } catch {
      setRunError('Could not reach /api/run-evals')
    } finally {
      setRunning(false)
    }
  }

  const stepData = steps.map(step => {
    const tests = results ? collectTests(step, results.testResults) : []
    return { step, tests, status: stepStatus(tests) }
  })

  const allPass = results?.success
  const totalPass = results?.numPassedTests ?? 0
  const totalFail = results?.numFailedTests ?? 0

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10 max-w-6xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="[font-size:var(--text-h1-sm)] [line-height:var(--leading-h1-sm)] font-[family-name:var(--font-family-display)] text-foreground">
              Eval Suite
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground font-[family-name:var(--font-family-body)] max-w-sm">
              Tests mapped to each step of the user journey.
            </p>
          </div>
          <Button onClick={run} disabled={running} size="lg" className="shrink-0">
            {running ? 'Running…' : results ? 'Re-run' : 'Run tests'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          <button
            onClick={() => { setTab('unit'); setRunError(null) }}
            className={`px-4 py-2 text-sm font-semibold font-[family-name:var(--font-family-body)] border-b-2 -mb-px transition-colors ${
              tab === 'unit'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Unit tests
          </button>
          <button
            onClick={() => { setTab('integration'); setRunError(null) }}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold font-[family-name:var(--font-family-body)] border-b-2 -mb-px transition-colors ${
              tab === 'integration'
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Database size={13} strokeWidth={ICON_STROKE_WIDTH} />
            Integration tests
          </button>
        </div>

        {/* Integration notice */}
        {tab === 'integration' && (
          <div className="mb-6 rounded-lg border border-border bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground font-[family-name:var(--font-family-body)]">
              Requires local Supabase running.{' '}
              <code className="bg-foreground/8 px-1 py-0.5 rounded text-[11px]">npx supabase start</code>
              {' '}in your terminal before running these.
            </p>
          </div>
        )}

        {/* Error */}
        {runError && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3">
            <p className="text-sm text-destructive font-[family-name:var(--font-family-body)]">{runError}</p>
          </div>
        )}

        {/* Summary pill */}
        {results && (
          <div
            className={`mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm font-semibold font-[family-name:var(--font-family-body)] border ${
              allPass
                ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}
          >
            {allPass ? (
              <CheckCircle2 size={16} strokeWidth={ICON_STROKE_WIDTH} />
            ) : (
              <XCircle size={16} strokeWidth={ICON_STROKE_WIDTH} />
            )}
            {allPass
              ? `All ${totalPass} tests passed`
              : `${totalFail} failed · ${totalPass} passed`}
          </div>
        )}

        {/* Journey columns */}
        <div className="flex flex-col md:flex-row gap-0 md:gap-0 items-stretch">
          {stepData.map(({ step, tests, status }, i) => (
            <StepColumn
              key={step.id}
              step={step}
              index={i}
              tests={tests}
              status={status}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>

        {/* Empty state */}
        {!results && !running && !runError && (
          <p className="mt-6 text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            Press &ldquo;Run tests&rdquo; to execute the eval suite and populate the journey.
          </p>
        )}

        {running && (
          <p className="mt-6 text-sm text-muted-foreground font-[family-name:var(--font-family-body)]">
            Running {tab} tests…
          </p>
        )}
      </div>
    </div>
  )
}
