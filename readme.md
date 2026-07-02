# OverYonder Frontend Design

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


## Project Folder Structure
<pre lang="markdown"> 
/frontend_web/

├── src/app/
│   ├── layout.tsx                        # Global layout
│   ├── page.tsx                          # Landing
│   ├── dashboard/                        # All role-specific dashboard routes
│   │   ├── layout.tsx                    # Shared dashboard shell
│   │   ├── page.tsx                      # Dashboard router → redirect by role
│   │   ├── oy-admin/                     # OY Admin landing
│   │   ├── institution-admin/            # Institution Admin dashboard
│   │   ├── student-leader/               # Student Leader dashboard
│   │   ├── student/                      # Student dashboard
│   │   └── faculty/                      # Faculty dashboard
│   ├── onboarding/                       # Institution onboarding flow
│   │   └── page.tsx
│   ├── login/                            # Auth UI
│   │   └── page.tsx
│   └── api/                              # Route handlers if needed
│       └── ...
├── features/
│   ├── events/
│   │   ├── components/
│   │   │   ├── EventCard.tsx
│   │   │   └── CreateEventForm.tsx
│   │   ├── hooks/
│   │   │   └── useEvents.ts
│   │   ├── api.ts                        # API calls (Supabase)
│   │   └── types.ts
│   ├── organizations/
│   │   ├── components/
│   │   └── hooks/
│   │   └── api.ts
│   ├── institutions/
│   │   ├── components/
│   │   ├── InstitutionSwitcher.tsx
│   │   └── api.ts
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── api.ts
│   ├── tags/
│   │   ├── components/
│   │   └── api.ts
│   └── categories/
│       ├── components/
│       └── api.ts
├── components/                           # Global/shared UI components
│   ├── dashboard/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── RoleBasedGuard.tsx
│   ├── shared/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
├── context/
│   ├── UserContext.tsx                   # Supabase session, role, etc.
│   └── InstitutionContext.tsx           # OY Admin switchable context
├── hooks/
│   ├── useAuth.ts
│   ├── useRole.ts
│   └── useInstitution.ts
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── utils.ts
├── constants/
│   ├── roles.ts
│   └── defaults.ts
├── styles/
│   └── globals.css
├── public/
│   └── images/
├── middleware.ts                         # Route access control
├── .env.local
├── tailwind.config.js
├── tsconfig.json
└── README.md
</pre>


## Landing Page Design
- Hero section
  - Tagline: "The Event Platform for Student Life"
  - Subtext: "Used by student orgs and institutions to boost campus engagement."
  - CTA: [Join Your School] [Request Access]

- Trusted by / Logos
  - “College of Idaho” + others you pilot

- Features
  - “For Students” → Discover, favorite, RSVP
  - “For Student Leaders” → Manage orgs, send invites
  - “For Institutions” → Approve events, post announcements

- Screenshots or demo GIFs
  - From your MVP

- “How It Works”
  - Step 1: Student logs in with school ID
  - Step 2: Events automatically match your campus
  - Step 3: Leaders and Admins create & track engagement

- Testimonials (if any)

- FAQ
  - "Do I need to register my school?"
  - "Can I use this without being in a club?"

- CTA Footer
  - “Students: Try OverYonder → [Sign in with your school]”
  - “Admins: Book a demo or request access”

- Login + Request Access Modals
