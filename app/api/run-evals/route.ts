import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    const { stdout } = await execAsync(
      'npx vitest run --project=unit --reporter=json',
      { cwd: process.cwd(), timeout: 120_000 }
    )
    return Response.json(JSON.parse(stdout))
  } catch (err: unknown) {
    // vitest exits with non-zero when tests fail, but stdout still contains valid JSON
    if (err && typeof err === 'object' && 'stdout' in err) {
      const stdout = (err as { stdout: string }).stdout
      try {
        return Response.json(JSON.parse(stdout))
      } catch {
        // stdout wasn't JSON — fall through to error response
      }
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: 'Failed to run evals', detail: message }, { status: 500 })
  }
}
