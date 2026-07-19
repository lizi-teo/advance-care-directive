import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Daily heartbeat so the Supabase Free plan project isn't paused for inactivity.
// Invoked by the Vercel Cron entries in vercel.json. See supabase/migrations/20260719_create_awake.sql.
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Checked before the auth comparison: without this, an unset CRON_SECRET would
  // make `Bearer undefined` a valid credential.
  if (!cronSecret || !url || !serviceRoleKey) {
    console.error('[awake] missing CRON_SECRET, NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return Response.json({ error: 'Not configured' }, { status: 500 })
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Not the shared client in lib/supabase.ts — that one is the browser anon
  // client and has no access to _awake.
  const supabase = createClient(url, serviceRoleKey)

  try {
    const { data: pingedAt, error: pingError } = await supabase.rpc('ping_awake', {
      ping_source: 'vercel-cron',
    })
    if (pingError) throw pingError

    // Also exercise the read path real users hit, so the activity Supabase sees
    // isn't only a single service-role write.
    const { error: readError } = await supabase
      .from('values_categories')
      .select('id')
      .limit(1)
    if (readError) throw readError

    return Response.json({ ok: true, pinged_at: pingedAt })
  } catch (err) {
    console.error('[awake]', err)
    return Response.json({ error: 'Heartbeat failed' }, { status: 500 })
  }
}
