import { createClient } from '@supabase/supabase-js'

// Unauthenticated staleness check for the /api/awake heartbeat.
//
// Deliberately public and deliberately derived: it exposes only how long ago the
// last ping was, never the row itself. That lets the watchdog routine (and any
// uptime monitor) run with no credentials at all, rather than handing a
// service-role key to a scheduled agent just to read one timestamp.
//
// Crons run twice daily, so 36h without a ping means ~3 consecutive misses.
const STALE_AFTER_HOURS = 36

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error('[awake/status] missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return Response.json({ error: 'Not configured' }, { status: 500 })
  }

  const supabase = createClient(url, serviceRoleKey)

  try {
    const { data, error } = await supabase
      .from('_awake')
      .select('pinged_at, ping_count')
      .eq('id', 1)
      .single()
    if (error) throw error

    const hoursSincePing = (Date.now() - new Date(data.pinged_at).getTime()) / 3_600_000
    const stale = hoursSincePing > STALE_AFTER_HOURS

    return Response.json(
      {
        stale,
        hours_since_ping: Number(hoursSincePing.toFixed(1)),
        stale_after_hours: STALE_AFTER_HOURS,
        ping_count: data.ping_count,
        last_ping: data.pinged_at,
      },
      // Non-200 when stale so a plain uptime monitor can alert on status code alone.
      { status: stale ? 503 : 200 },
    )
  } catch (err) {
    console.error('[awake/status]', err)
    return Response.json({ error: 'Status check failed' }, { status: 500 })
  }
}
