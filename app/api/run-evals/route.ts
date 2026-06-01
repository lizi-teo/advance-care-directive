import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, unlink } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const execAsync = promisify(exec)

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return Response.json({ error: 'Not available in production' }, { status: 403 })
  }

  const outputFile = join(tmpdir(), `vitest-evals-${Date.now()}.json`)

  try {
    await execAsync(
      `npx vitest run --project=unit --reporter=json --outputFile=${outputFile}`,
      { cwd: process.cwd(), timeout: 120_000 }
    )
  } catch {
    // vitest exits with non-zero when tests fail — that's fine, the file still exists
  }

  try {
    const raw = await readFile(outputFile, 'utf-8')
    await unlink(outputFile).catch(() => {})
    return Response.json(JSON.parse(raw))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: 'Failed to run evals', detail: message }, { status: 500 })
  }
}
