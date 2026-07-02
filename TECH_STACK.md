# Technical Stack Documentation

This document explains every major framework, library, and tool used in the
OverYonder web frontend, **why** it was chosen, and the **trade-offs** against
the alternatives that were considered. It is meant to give a new engineer (or a
reviewer) enough context to understand the architecture without reverse
engineering `package.json`.

> Snapshot: Next.js 15 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
> Supabase (Postgres + Auth + Storage + RLS) · TanStack Query · Sentry · PostHog
> · deployed on Vercel.

---

## 1. Core Framework — Next.js 15 (App Router)

**What:** React meta-framework providing routing, server components, server
actions, API routes, and image optimization. We run it on the App Router with
Turbopack in dev (`next dev --turbopack`).

**Why we chose it:**
- **Server Components + RLS synergy.** Data-fetching happens on the server close
  to Supabase, so auth cookies and Row Level Security are enforced server-side
  before HTML reaches the browser. See `src/lib/serverAuth.ts` and
  `src/lib/supabaseRouteClient.ts`.
- **One codebase, three surfaces.** Marketing pages (`/`, `/privacy`, `/terms`),
  the authenticated dashboard, and the JSON API (`src/app/api/**`) all live in
  one deployable unit.
- **First-class Vercel deploy** and built-in cron (`vercel.json` →
  `/api/push/dispatch`), image optimization, and middleware for auth gating.

**Trade-offs vs. alternatives:**
| Alternative | Why not |
|---|---|
| **Vite + React SPA** | No server rendering, so RLS-protected data would require a separate backend; SEO for public event/marketing pages would suffer. |
| **Remix / React Router 7** | Comparable DX, but weaker Vercel-native integration (cron, image opt, Sentry wizard) and a smaller ecosystem for our needs. |
| **Plain Node/Express + CRA** | We'd rebuild routing, SSR, bundling, and code-splitting ourselves. |

**Cost of this choice:** App Router's server/client boundary (`"use client"`)
has a learning curve, and Turbopack/RSC edges occasionally surface framework
bugs. We accept this for the SSR + security model.

---

## 2. UI Runtime — React 19

**What:** The component library underneath Next.js.

**Why:** Required by Next 15; unlocks `useSyncExternalStore` (used by our
lightweight stores), improved Suspense, and the new Actions model.

**Trade-off:** React 19 is recent enough that a few third-party libraries lag on
peer-dependency ranges. This is mitigated because most of our UI deps (Radix,
Headless UI, Framer Motion) already support 19.

---

## 3. Language — TypeScript 5

**What:** Static typing across the whole codebase, including
**generated database types** (`src/lib/database.types.ts`) produced from the
Supabase schema.

**Why:** End-to-end type safety from Postgres columns → API → React props. A
schema change that breaks a query is caught at build time, not in production.

**Trade-off vs. plain JS:** More upfront ceremony and a build/typecheck step.
Worth it given the size of the data model (institutions, orgs, events, friends,
notifications, RLS roles). Note from project memory: **do not wholesale-regenerate
`database.types.ts`** — the OY-admin cross-institution surface depends on hand-
tuned types, and a full regen breaks the build.

---

## 4. Data Layer — Supabase (Postgres, Auth, Storage, RLS)

**What:** Our entire backend. Postgres database, GoTrue auth, object storage,
and Row Level Security. Migrations live in `supabase/migrations/`, and access
goes through three clients:
- `src/lib/supabase.ts` — browser client (`createBrowserClient`)
- `src/lib/supabaseRouteClient.ts` / `serverAuth.ts` — server/route clients
- Middleware for session refresh

**Why we chose it:**
- **RLS as the security boundary.** Authorization lives in the database
  (`20260611120002_rls_policies.sql`, `users_role_guard`), not scattered across
  application code. Even a leaked anon key can't read data the policy forbids.
- **SECURITY DEFINER triggers** power notifications and counts
  (`event_attendance_count`, notification triggers) without trusting the client.
- **Batteries included:** auth (email confirm, password reset), storage (avatars/
  media via signed URLs, allowlisted in `next.config.ts`), and SQL in one product.
- **Own your data:** it's plain Postgres, so no proprietary lock-in on the DB itself.

**Trade-offs vs. alternatives:**
| Alternative | Why not |
|---|---|
| **Firebase / Firestore** | NoSQL model fits our relational data (institutions ⇄ orgs ⇄ events ⇄ users) poorly; weaker ad-hoc querying; harder to express RLS-style rules. |
| **Custom Node/Nest + Postgres** | We'd build auth, storage, and a policy engine ourselves — months of work Supabase gives for free. |
| **Prisma + hosted Postgres** | Great ORM DX, but authorization would move back into app code; no built-in auth/storage. |

**Known constraint (from project memory):** locally we run a **dual Supabase
stack** — `frontend_web` on ports `54331+`, a sibling app owns `54321+`. The
schemas collide, so the two stacks must **never** be merged.

**RLS caveat:** OY-admin needs cross-institution reads, so those paths use the
**browser client with RLS**, *not* `SECURITY DEFINER`, to avoid privilege leaks.

---

## 5. Server-State — TanStack Query (React Query) v5

**What:** Caching, deduplication, and background refetching of server data on the
client.

**Why:** Server data (event lists, org membership, notifications) needs caching,
stale-while-revalidate, and request dedup — problems TanStack Query solves
declaratively instead of hand-rolled `useEffect` + `useState` fetching.

**Trade-off vs. alternatives:** SWR is lighter but TanStack Query has richer
mutation/invalidation ergonomics, which matters for RSVP/friends/notifications
flows. We deliberately do **not** use it for global *client* state (see next).

---

## 6. Client-State — Lightweight `useSyncExternalStore` stores

**What:** Hand-written external stores for cross-component client state:
`favoritesStore.ts`, `friendsStore.ts`, `rsvpStore.ts`, `notificationsStore.ts`.
Each is a module-level `Set`/state + listener set subscribed via React 19's
`useSyncExternalStore`.

**Why:** These slices are small, optimistic, and shared across many cards (e.g.
every `EventCard` for the same event must reflect the same favorite state). A
~40-line store with optimistic updates is simpler than pulling in a full state
library, and it writes straight to RLS-protected tables.

**Trade-offs vs. alternatives:**
| Alternative | Why not |
|---|---|
| **Redux Toolkit** | Far too much boilerplate for a handful of `Set<string>` slices. |
| **Zustand / Jotai** | Reasonable, but the native `useSyncExternalStore` pattern removed a dependency entirely for the same result. |
| **React Context** | Would re-render whole subtrees on every favorite/RSVP toggle; external stores let only subscribed components update. |

---

## 7. Styling — Tailwind CSS 4 + shadcn/ui + Radix + Headless UI

**What:**
- **Tailwind CSS 4** (PostCSS plugin, CSS-first `@theme` config in
  `globals.css`) — utility styling.
- **shadcn/ui** (`components.json`, "new-york" style, RSC-enabled) — copy-in
  component source living in `src/components/ui`.
- **Radix UI** primitives (dialog, tabs, avatar, progress, slot) — accessible
  unstyled behavior under shadcn components.
- **Headless UI** — a few additional accessible primitives.
- **CVA + `tailwind-merge` + `clsx` + `tailwind-variants`** — variant/class
  composition.
- **`tw-animate-css`** and **Framer Motion** — animation.
- **lucide-react** / **react-icons** — icons.

**Why this combination:**
- Tailwind 4's CSS-first theming (`@theme inline`, dark via `@custom-variant`)
  removes the JS `tailwind.config` and speeds up builds.
- **shadcn owns the source, not a dependency.** We can edit components directly
  instead of fighting a library's API — important for a bespoke design.
- Radix/Headless give **accessibility for free** (focus traps, ARIA, keyboard
  nav) so we don't hand-roll dialogs and tabs.

**Trade-offs vs. alternatives:**
| Alternative | Why not |
|---|---|
| **MUI / Chakra / Ant Design** | Opinionated visual identity that's hard to fully customize; larger runtime; theming fights our design. |
| **Plain CSS / CSS Modules** | Loses utility velocity and design-token consistency. |
| **Fully custom accessible components** | Re-implementing Radix's a11y correctly is expensive and error-prone. |

**Cost:** Utility-heavy JSX can be verbose, and there are several overlapping
class-composition helpers (CVA, tailwind-variants, tailwind-merge) that a new
dev must learn.

---

## 8. Forms — React Hook Form

**What:** Form state/validation, e.g. `CreateEventForm.tsx`.

**Why:** Uncontrolled inputs minimize re-renders on large forms (event creation
has many fields); clean integration with Radix/shadcn inputs.

**Trade-off:** Formik is the main alternative but re-renders more and is less
maintained; we didn't add a schema validator (Zod) library-wide, keeping
validation inline where sufficient.

---

## 9. Domain-Specific Libraries

| Library | Purpose | Why / trade-off |
|---|---|---|
| **date-fns + date-fns-tz** | Date math & timezone handling (`src/lib/time.ts`) | Tree-shakeable, functional. Chosen over Moment.js (deprecated, mutable, heavy) and Luxon (fine, but date-fns pairs better with tree-shaking). |
| **rrule** | Recurring events (RFC 5545 RRULEs) | The de-facto standard for calendar recurrence; hand-rolling recurrence math is a bug farm. |
| **Leaflet + @types/leaflet** | Interactive maps (`src/components/map`) | Open-source, no API-key/billing surprises. Trade-off vs. Google/Mapbox: fewer managed features, but no per-load cost or vendor lock-in. |
| **googleapis + jsonwebtoken** | Google Calendar sync / OAuth (`googleClient.ts`, `user_google_tokens`) | Official SDK; JWT for signed server tokens. |
| **recharts** | Dashboard charts (OY-admin analytics) | Declarative React charts; lighter learning curve than D3. Trade-off: less flexible than raw D3 for exotic viz, which we don't need. |
| **@dnd-kit/core + sortable** | Drag-and-drop ordering | Modern, accessible, React-19-friendly replacement for react-beautiful-dnd (unmaintained). |
| **@tippyjs/react** | Tooltips/popovers | Lightweight positioning where Radix isn't already in play. |
| **uuid** | Client-side id generation | Standard. |

---

## 10. Notifications & Push

**What:** In-app notifications (Postgres `notifications` table + SECURITY DEFINER
triggers) and **browser push** via **`web-push`** (VAPID) with a service worker.
Delivery is driven by a Vercel cron hitting `/api/push/dispatch` every minute
(`vercel.json`), sending T-30 / T-15 / T-0 event reminders.

**Why `web-push` + cron over a managed service (FCM/OneSignal):**
- No third-party SDK on the client; VAPID web push is a browser standard.
- The cron + Postgres approach keeps scheduling logic in our own data model,
  reusable by both in-app and push channels.

**Trade-off:** We own retry/delivery semantics and the every-minute cron cost;
a managed push provider would handle scale and analytics but add a vendor,
a client SDK, and cost.

---

## 11. Observability & Analytics

| Tool | Role | Why / trade-off |
|---|---|---|
| **Sentry (`@sentry/nextjs`)** | Error & exception tracking; source maps uploaded only in CI/prod (`next.config.ts` `withSentryConfig`). | Best-in-class stack traces + Next.js wizard. Explicitly the **only** error reporter — PostHog error capture is disabled to avoid duplicates. |
| **PostHog (`posthog-js`)** | Product analytics, **gated on cookie consent** (`analytics.ts`, `cookieConsent.ts`) — only inits with a key *and* consent. | Product-analytics + session tooling in one. Consent-gating keeps us privacy-compliant. Trade-off vs. GA4: PostHog is more product-event oriented and self-hostable. |

**Design principle:** clear separation — **Sentry = errors, PostHog = product
usage** — so neither double-reports.

---

## 12. Build, Quality & Deploy Tooling

| Tool | Role | Notes / trade-off |
|---|---|---|
| **Turbopack** (dev) | Fast dev bundler | Next-native, much faster HMR than Webpack. Still maturing, so prod `build` uses the stable pipeline. |
| **ESLint 9 + eslint-config-next** | Linting (`eslint.config.mjs`, flat config) | Next-aware rules out of the box. |
| **PostCSS + autoprefixer** | CSS pipeline for Tailwind 4 (`postcss.config.mjs`) | Required by Tailwind 4's PostCSS plugin. |
| **Supabase CLI** (`supabase` dep) | Local stack + migrations (`config.toml`, `supabase/migrations`) | Reproducible schema; migration-first workflow. |
| **Vercel** | Hosting + cron + edge | Zero-config Next.js deploys and native cron for push dispatch. Trade-off: some vendor lock-in around cron/image config, mitigated by Next being portable. |
| **GitHub Actions** (`.github/workflows/ci.yml`) | CI | Lint/typecheck/build gate. |

---

## Summary of the Guiding Principles

1. **Security lives in the database.** RLS + `SECURITY DEFINER` triggers make
   authorization declarative and hard to bypass from the client.
2. **Own the source where design matters** (shadcn), **rent it where correctness
   is hard** (Radix a11y, rrule, date-fns, web-push standards).
3. **Right tool per state type** — TanStack Query for server state, tiny
   `useSyncExternalStore` stores for shared optimistic client state; no heavy
   global store library.
4. **Standards over vendors** where feasible — VAPID web push, Leaflet, plain
   Postgres — to limit lock-in and recurring cost.
5. **Separation of observability** — Sentry for errors, PostHog for product,
   both consent-aware.
