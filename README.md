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
