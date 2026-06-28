# Deploy runbook — OverYonder (frontend_web)

Production checklist for taking the app live. Order matters: provision the
database first, then the app, then the cron. Items marked **[you]** require
account access / dashboard actions; the rest are in this repo.

---

## 0. Pre-flight (local)

- [ ] Confirm migrations apply cleanly from scratch: `supabase db reset` (this
      wipes the local DB and re-runs every migration in order + seed). Do this
      once — it is the same path `supabase db push` takes against a fresh remote.
- [ ] `npm run build` is green.
- [ ] Migration versions are unique (no two files share a numeric prefix).
      The old `20260611120007_jwt_institution_status.sql` was renumbered to
      `…120013` precisely to fix a duplicate-version collision — don't reintroduce it.

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

- [ ] Import the repo. Set all env vars from `.env.example` (Production scope).
      `next.config.ts` now derives the next/image storage host from
      `NEXT_PUBLIC_SUPABASE_URL`, so no image-host edit is needed per environment.
- [ ] Set `NEXT_PUBLIC_APP_URL` to the canonical domain.
- [ ] Generate prod Web Push keys: `npx web-push generate-vapid-keys` →
      `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`; set `VAPID_SUBJECT`
      to `mailto:admin@your-domain.com`.
- [ ] Generate `CRON_SECRET`: `openssl rand -hex 32`.
- [ ] Deploy.

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

## 5. Smoke test (prod)

- [ ] Sign up a new user → receive confirmation email → confirm → land on
      `/onboarding`.
- [ ] Complete onboarding; verify routing by role.
- [ ] As an OY Admin, approve a pending institution at
      `/dashboard/oy/institutions`; confirm a member of that institution is
      released from `/pending` after re-login (JWT refresh carries the new
      `institution_status`).
- [ ] Upload an avatar and confirm the image renders (validates next/image host).

---

### Known follow-ups (not blockers)
- OY Admin `/dashboard/oy/{users,reports,media}` pages 404 (not built yet).
- `features/{institutions,tags,categories}/api.ts` are TODO stubs.
- Missing `public/images/student-preview.png` (landing-page next/image 400).
- Remove stray `console.log`s; Nominatim geocoder (`src/lib/geocode.ts`) is
  capped ~1 req/s — self-host or pay for scale.
- Add privacy policy / terms.
