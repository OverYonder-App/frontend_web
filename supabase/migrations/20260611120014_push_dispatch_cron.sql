-- Schedule the push-reminder dispatcher with pg_cron + pg_net (Phase 2, prod
-- scheduler). Replaces the need for Vercel Cron Pro: every minute, Postgres
-- itself POSTs to /api/push/dispatch with the bearer secret, and the route does
-- the T-30/15/0 send (see src/app/api/push/dispatch/route.ts).
--
-- Secrets are NOT hardcoded here (the file is committed). The job reads the app
-- URL and the dispatch bearer token from Supabase Vault and NO-OPs until both
-- are seeded — so this is safe to apply locally / before secrets exist. Seed
-- them per environment (Supabase SQL editor or psql), e.g.:
--
--   select vault.create_secret('https://your-domain.com', 'project_url',
--          'Base URL for cron HTTP calls');
--   select vault.create_secret('<CRON_SECRET>', 'cron_secret',
--          'Bearer token for /api/push/dispatch');
--
-- Requires pg_cron in shared_preload_libraries (true on Supabase + the local
-- CLI stack). To run dispatch manually for testing: select public.dispatch_push_reminders();

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- ── The thing the cron calls: read secrets from Vault, fire one HTTP POST ─────
create or replace function public.dispatch_push_reminders()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url    text;
  v_secret text;
begin
  select decrypted_secret into v_url
    from vault.decrypted_secrets where name = 'project_url' limit 1;
  select decrypted_secret into v_secret
    from vault.decrypted_secrets where name = 'cron_secret' limit 1;

  -- No-op until both secrets exist (e.g. local dev without Vault configured).
  if v_url is null or v_secret is null then
    return;
  end if;

  perform net.http_post(
    url     => rtrim(v_url, '/') || '/api/push/dispatch',
    headers => jsonb_build_object(
      'Authorization', 'Bearer ' || v_secret,
      'Content-Type',  'application/json'
    ),
    body    => '{}'::jsonb
  );
end;
$$;

-- Vault-reading definer function: keep it off the public API surface.
revoke all on function public.dispatch_push_reminders() from public;
revoke all on function public.dispatch_push_reminders() from anon, authenticated;

-- ── Schedule it every minute (idempotent: replace any existing job) ──────────
select cron.unschedule('push-dispatch')
where exists (select 1 from cron.job where jobname = 'push-dispatch');

select cron.schedule(
  'push-dispatch',
  '* * * * *',
  $$select public.dispatch_push_reminders();$$
);
