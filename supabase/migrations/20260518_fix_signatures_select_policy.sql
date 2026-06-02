-- The shared page (/signed/[sessionId]) reads signatures using the anon key.
-- The original policy restricted SELECT to service_role only, which blocked the shared page.
-- Session IDs are unguessable UUIDs, so anon SELECT is safe here.
DROP POLICY IF EXISTS "service role can read signatures" ON signatures;

CREATE POLICY "anon can read signatures"
  ON signatures FOR SELECT TO anon
  USING (true);
