<<<<<<< HEAD
# SpeciaLevel Marketing Website

A standalone, high-performance Next.js marketing website for **SpeciaLevel** (Custom AI Automation & Systems Integration).

## Features

- **Next.js App Router (v16)**: Fast, server-first architecture with React 19.
- **Internationalization (i18n)**:
  - Full English (`en`) and Arabic (`ar`) support via dictionary JSON files (`lib/i18n/dictionaries/`).
  - Native RTL bidirectional layout switching (`dir="rtl"` / `dir="ltr"`).
  - Cookie-based locale persistence (`NEXT_LOCALE`) with instant server revalidation.
  - Font optimization: Latin fonts (`Geist`, `Geist_Mono`) by default; `Cairo` loaded dynamically for Arabic visitors.
- **Theming & Design Tokens**:
  - Dark / Light / System theme switching via `next-themes` and Tailwind CSS design tokens.
  - Responsive navigation with interactive mobile drawer and floating header.
- **Lead Capture & Ingestion**:
  - Direct API route at `/api/public/leads` with Zod schema validation.
  - Resilient capture pipeline: forwards submissions to the core platform (`NEXT_PUBLIC_APP_URL/api/public/leads`), optional webhook dispatcher (`MARKETING_LEADS_WEBHOOK_URL`), and local JSONL fallback (`data/marketing-leads.jsonl`).
- **External SaaS Platform Integration**:
  - Configurable `NEXT_PUBLIC_APP_URL` linking client login buttons directly to the authenticated client portal.

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm or pnpm

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | URL of the core SaaS / Client Portal application | `http://localhost:3000` |
| `MARKETING_LEADS_WEBHOOK_URL` | *(Optional)* Webhook URL for marketing lead fan-out | — |

### Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Typecheck

```bash
# Typecheck
npm run typecheck

# Production Build
npm run build

# Start Production Server
npm run start
```

## Directory Structure

```
SpeciaLevel-marketing-export/
├── app/
│   ├── (marketing)/             # Marketing page and layout
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── public/leads/        # Lead capture endpoint
│   ├── globals.css              # Tailwind CSS theme tokens
│   └── layout.tsx               # Root layout with fonts, theme provider, and i18n
├── components/
│   ├── marketing/               # Hero, Services, Packages, Process, FAQ, Contact, Nav, Footer
│   ├── ui/                      # Reusable UI primitives (Button, Card, Input, etc.)
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── data/
│   └── marketing-leads.jsonl    # Local fallback lead archive
├── lib/
│   ├── actions/                 # Server actions (locale, marketing-leads)
│   ├── i18n/                    # Dictionaries (en.json, ar.json) & loaders
│   └── validations/             # Zod validation schemas
└── next.config.ts
```
=======
# SpeciaLevel website

Local Next.js 16 / React 19 marketing site with Home (`/`), Platform (`/platform`), Services (`/services`) and a client portal access page (`/login`). English and Arabic are supported, with RTL layout and light/dark themes.

## Local development

Use Node.js 20.9 or newer and the existing npm lockfile. Install dependencies with `npm ci` if needed, copy `.env.example` to `.env.local`, then run `npm run dev`. The default preview is http://localhost:3000. If another preview is running for this folder, reuse it rather than starting a second server.

Checks:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

For an environment where Turbopack fails to resolve Windows filesystem paths, use `npm run build -- --webpack` or `npm run dev -- --webpack`. Builds fetch Geist, Geist Mono and Cairo through `next/font/google`, so the build environment needs access to Google Fonts.

## Current functionality

No backend is connected. The platform page describes the intended product; it does not implement CRM, billing, accounts or automation. Trial links navigate to the Platform page, which has a distinct animated workspace hero followed by three inline plan cards. Continuing with a plan reveals an inline trial-request form; it does not create an account or provision a trial. Booking uses an embedded calendar only when configured; otherwise it collects a callback request. The support launcher opens an inquiry form, not live chat.

The portal page does not collect credentials. Set `NEXT_PUBLIC_PORTAL_LOGIN_URL` to the real portal's full sign-in URL to enable its handoff button. Without it, visitors see an access-help link.

## Lead capture

The inquiry server action validates form values and writes one record to `data/marketing-leads.jsonl`. Local records are ignored by Git. With no external destination configured, this is a development inbox only: the team receives no automatic email or notification.

Optional server-only settings:

- `MARKETING_LEADS_API_URL`: full ingestion URL on an external backend. Do not point it at this marketing site.
- `MARKETING_LEADS_WEBHOOK_URL`: optional webhook receiving `marketing.lead_created` events.

Delivery waits for configured destinations and the local archive; it reports success only if at least one succeeds. The public `/api/public/leads` endpoint validates and archives submissions, returns 400 for invalid input and 503 for failed storage, and does not echo submitted personal data. It does not forward requests, preventing recursive ingestion.

Local files are unsuitable as the only inbox on an ephemeral deployment. Before launch, connect durable storage and notifications, and add spam protection and request limits.

Other settings:

- `NEXT_PUBLIC_BOOKING_URL`: embed-compatible booking calendar URL.
- `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SIGNUP_URL`: retained legacy settings; the current trial flow does not use them.

## Source map

- `components/marketing/page-content.tsx`: current Home, Platform and Services page content.
- `components/marketing/experience.tsx`: inquiry dialogs, inline plan selection and trial requests, and page scrolling.
- `components/marketing/platform-hero.tsx`: dedicated Platform hero and animated workspace preview.
- `components/marketing/service-explorer.tsx`: interactive services tabs.
- `app/(marketing)/marketing.css`: current marketing styles.
- `lib/i18n/dictionaries/`: dictionaries used by the locale loader. Some current copy is inline in page components.
- `lib/marketing-proof.ts`: approved projects and testimonials. Both collections are currently empty.
- `lib/marketing-leads.ts`: shared archive and delivery helpers.
- `tests/marketing-leads.test.cjs`: isolated validation, persistence and delivery regression checks.

Older section components and the root `dictionaries/` folder coexist with the active implementation. Confirm references before editing them or removing them.
>>>>>>> f0c90fc (Latest Front End)
