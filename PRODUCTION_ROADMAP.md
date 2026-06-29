# Production roadmap — OverYonder

The product is built and verified. What remains is operational maturity, in four
phases. See `DEPLOY.md` for the step-by-step launch checklist.

## Phase 0 — Ship the MVP (this week)
Follow `DEPLOY.md`. The four things that silently break launch if missed:
1. Enable the `auth_customize_jwt` access-token hook in the Supabase dashboard.
2. Real SMTP (Resend) with a verified sending domain (DKIM).
3. Do NOT run the dev `seed.sql`; bootstrap a platform institution + your OY Admin.
4. Set every env var from `.env.example`.

Then run the prod smoke test: signup → confirm email → onboard → approve an
institution → member released from `/pending`.

## Phase 1 — Production hardening (first 1–2 weeks live)
- **Error monitoring** — PostHog error tracking is wired (see `src/lib/analytics.ts`,
  consent-gated). For deeper stack traces / alerting, add Sentry (`@sentry/nextjs`).
- **Uptime + backups** — uptime monitor on the domain; enable Supabase PITR/backups.
- **CI** — GitHub Action running `tsc` + `build` + `lint` on every PR.
- **Staging** — a second Supabase project + Vercel preview so migrations never hit
  prod untested (formalize the `supabase db reset` preflight).
- **Security review** — run `/security-review`; re-audit the ~30 RLS policies.
- **Rate limiting** — on auth and public API routes.

## Phase 2 — Operational readiness (weeks 2–6)
- **Analytics** — PostHog is in, gated behind the cookie consent
  (`hasAnalyticsConsent()`). Define the activation funnel events.
- **Feedback loop** — in-app "report a problem"; watch the OY Admin reports queue.
- **Performance** — Nominatim geocoder is capped ~1 req/s (self-host or pay before
  scale); optimize uploaded images.
- **Accessibility + mobile** — proper a11y pass.

## Phase 3 — Scale (after the first paying campus)
- Per-institution **theming** (brand colors are stored but the UI uses the static
  `--primary` token — wire them up for institutional buyers).
- **SSO / SAML** (universities expect it).
- **FERPA / data-privacy** posture for institutional contracts.
- **PWA / native** wrapper.

## Status snapshot (2026-06)
- Auth, multi-tenant onboarding, `/pending` gate, institution self-serve + OY Admin
  approval, events/clubs/RSVP, friends + "friends going", in-app notifications,
  push reminders (pg_cron path built), OY Admin surface, legal pages, cookie
  consent, settings — all built and browser-verified.
- Migration chain verified clean-from-zero (`supabase db reset` preflight passed).
