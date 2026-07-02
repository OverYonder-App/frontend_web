# Deploy runbook — OverYonder (frontend_web)

Production checklist for taking the app live. Order matters: provision the
database first, then the app, then the cron. Items marked **[you]** require
account access / dashboard actions; the rest are in this repo.

---

## 0. Pre-flight (local)

- [ ] `npm run lint` + `npx tsc --noEmit` + `npm run build` are green. (These
      three also run in CI on every push/PR — see `.github/workflows/ci.yml`.)
- [ ] Confirm migrations apply cleanly from scratch: `supabase db reset` (this
      wipes the local DB and re-runs every migration in order + seed). It is the
      same path `supabase db push` takes against a fresh remote. (Migrations now
      through `20260611120016`; the chain through 120015 was verified clean
      2026-06-27.)
- [ ] Migration versions are unique (no two files share a numeric prefix).
      The old `20260611120007_jwt_institution_status.sql` was renumbered to
      `…120013` to fix a duplicate-version collision — don't reintroduce it.

## 1. Hosted Supabase project **[you]**

- [ ] Create a project at supabase.com. Note the **Project URL**, **anon** key,
      and **service_role** key (Settings → API).
- [ ] Link the CLI and push the schema:
      ```sh
      supabase link --project-ref <ref>
      supabase db push          # applies supabase/migrations/* in order
      ```
- [ ] **Do NOT run `supabase/seed.sql` in prod** — it is entirely dev fixtures
      (two test institutions + five `password123` users + sample content). Prod
      starts empty.
- [ ] **Bootstrap the platform + your first OY Admin** (without this, nobody can
      approve the first real institution). Sign up normally with your admin email
      first, then run in the Supabase SQL editor:
      ```sql
      -- 1. Platform institution (the after-insert trigger seeds its roles, incl. 'OY Admin')
      insert into public.institutions (institution_name, abbreviated_name, status)
      values ('OverYonder', 'OY', 'approved')
      returning institution_id;            -- copy this id

      -- 2. Promote your account to OY Admin of it
      update public.users
      set institution_id = '<institution_id>',
          role_id = (select role_id from public.roles
                     where institution_id = '<institution_id>' and role_name = 'OY Admin'),
          onboarding = true
      where email = 'you@yourdomain.com';
      ```
      Then sign out and back in so the JWT carries the OY Admin role. Real schools
      now self-serve and you approve them at `/dashboard/oy/institutions`.
- [ ] **Enable the custom access-token hook.** This is configured only in local
      `config.toml` and is NOT applied by `db push`. In the dashboard:
      Authentication → Hooks → **Customize Access Token (JWT) Claims** →
      enable, set to the Postgres function `public.auth_customize_jwt`.
      ⚠️ Without this, `role_type` / `institution_id` / `onboarding` /
      `institution_status` are absent from the JWT and **all** RLS, routing, and
      the `/pending` gate break.
- [ ] **SMTP** (Authentication → Email → SMTP settings). Confirmation, magic-link,
      and password-reset emails are dead without a real SMTP provider
      (e.g. Resend, Postmark, SES). Set sender name/address too.
- [ ] **URL config** (Authentication → URL Configuration): set **Site URL** to
      the prod domain and add `https://your-domain.com/**` to redirect allow-list
      (mirrors local `config.toml` `site_url` / `additional_redirect_urls`).
- [ ] Keep email confirmations ON (local `config.toml` already sets
      `enable_confirmations = true`; verify the same in the dashboard).
- [ ] Create the storage bucket(s) used for avatars/logos if not created by
      migration `20260611120003_storage.sql` (verify after push).

## 2. Google OAuth **[you]**

- [ ] In Google Cloud Console add the prod redirect URI to the OAuth client and
      to Supabase (Authentication → Providers → Google).
- [ ] Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI`.

## 3. App (Vercel) **[you]**

Import the repo and set all env vars from `.env.example` (Production scope).
`next.config.ts` derives the next/image storage host from `NEXT_PUBLIC_SUPABASE_URL`,
so no per-environment image-host edit is needed. By group:

- [ ] **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
      `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] **App**: `NEXT_PUBLIC_APP_URL` = the canonical domain.
- [ ] **Google OAuth** (optional): `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` /
      `GOOGLE_REDIRECT_URI` (skip = the "Continue with Google" button errors;
      password + magic link still work).
- [ ] **Web Push**: `npx web-push generate-vapid-keys` →
      `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`; `VAPID_SUBJECT` =
      `mailto:admin@your-domain.com`; `CRON_SECRET` = `openssl rand -hex 32`.
- [ ] **Analytics (PostHog)**: `NEXT_PUBLIC_POSTHOG_KEY`,
      `NEXT_PUBLIC_POSTHOG_HOST`. Consent-gated — only loads after the user
      accepts cookies. Leave blank to disable.
- [ ] **Error monitoring (Sentry)**: `NEXT_PUBLIC_SENTRY_DSN` (runtime capture).
      For readable stack traces, also set `SENTRY_AUTH_TOKEN` as a **build-time**
      var so source maps upload (org/project default to `gerald-ux` /
      `javascript-nextjs` in `next.config.ts`; override with `SENTRY_ORG` /
      `SENTRY_PROJECT`). Leave the DSN blank to disable.
- [ ] Deploy.
- [ ] (CI) Add `SENTRY_AUTH_TOKEN` as a GitHub Actions repo secret if you want
      PR/build source-map uploads from CI too.

## 4. Push-reminder cron **[you]**

Pick ONE scheduler to hit `/api/push/dispatch` every minute.

**Option A — Supabase pg_cron (recommended; no Vercel Pro needed).** Migration
`20260611120014_push_dispatch_cron.sql` already schedules a per-minute job that
POSTs to the dispatch route via pg_net, reading the URL + bearer token from
**Vault**. It NO-OPs until you seed those secrets, so finish the setup:
- [ ] Confirm `pg_cron` + `pg_net` are enabled (the migration does `create
      extension if not exists`; on Supabase you can also toggle them under
      Database → Extensions).
- [ ] Seed the two Vault secrets (Supabase SQL editor), then the job goes live:
      ```sql
      select vault.create_secret('https://your-domain.com', 'project_url', 'cron base URL');
      select vault.create_secret('<CRON_SECRET>', 'cron_secret', 'dispatch bearer token');
      ```
      `<CRON_SECRET>` must match the app's `CRON_SECRET` env var.
- [ ] Test manually: `select public.dispatch_push_reminders();` then check
      `select status_code, content from net._http_response order by id desc limit 1;`
      (expect `200` / `{"ok":true,...}`).

**Option B — Vercel Cron.** `vercel.json` already declares the per-minute job, but
per-minute scheduling needs the **Pro** plan. If you use this, you don't need the
pg_cron job — drop/disable the migration's schedule to avoid double-dispatch
(harmless thanks to the `event_reminders_sent` dedup ledger, but wasteful).

- [ ] Verify the endpoint rejects unauthenticated calls (401) and that an
      upcoming event with a subscribed attendee produces a push at T-30/15/0.
      (Dispatch pipeline + pg_cron path were verified locally 2026-06-27:
      a real Web Push delivered and the dedup ledger blocked the double-send.)

## 5. Legal **[you]**

- [ ] In `/privacy` and `/terms`, replace the placeholders: real contact email
      (currently `support@overyonder.app`), your domain, and the governing-law
      jurisdiction. Have counsel review before relying on them.
- [ ] The privacy policy already discloses PostHog analytics + Sentry error
      monitoring + the cookie-consent banner — keep it in sync if you add or
      remove third-party services.

## 6. Smoke test (prod)

- [ ] Sign up a new user → receive confirmation email → confirm → land on
      `/onboarding`.
- [ ] Complete onboarding; verify routing by role.
- [ ] As an OY Admin, approve a pending institution at
      `/dashboard/oy/institutions`; confirm a member of that institution is
      released from `/pending` after re-login (JWT refresh carries the new
      `institution_status`).
- [ ] Create an event linked to an approved club; RSVP to it; join a club from
      `/dashboard/student/groups/<id>`.
- [ ] Upload an avatar and confirm the image renders (validates next/image host).
- [ ] Accept the cookie banner, then confirm PostHog receives the activation
      funnel events (`signed_up` → `onboarding_completed` → `club_joined` →
      `event_rsvp`) and that Sentry receives a test error.

---

### Known follow-ups (not blockers)
- Nominatim geocoder (`src/lib/geocode.ts`) is capped ~1 req/s — self-host or pay
  before scale.
- Per-institution **theming**: brand colors are editable in OY/admin settings and
  stored, but the UI still uses the static `--primary` token — wire them up if you
  sell branded institution spaces.
- The event create picker lists **clubs** only (`organization_type = 'club'`), not
  groups. The club link is now **optional** (migration `…120016`), so a new
  institution with no clubs can still create campus-wide events; add groups to the
  picker if you want events linkable to them too.
- Push reminders only fire once the pg_cron Vault secrets (or Vercel Cron) are set
  (§4) — optional for MVP.

### Done this cycle (for reference)
OY Admin surface (dashboard + institutions/users/reports/media), legal pages
(`/privacy`, `/terms`) + cookie consent, PostHog analytics + activation funnel,
Sentry error monitoring (Sentry-only), GitHub Actions CI, admin + student settings,
club/group view with join/leave, event→club linking fix, landing preview images,
console.log cleanup.
