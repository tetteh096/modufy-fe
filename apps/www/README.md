# Modufy Marketing Site (`apps/www`)

Public marketing website for Modufy — landing page, pricing, blog shell, demo requests, and contact.

Deploys to **modufy.app** (or your marketing domain). The product app lives at `apps/web` (`app.modufy.app`).

## Local development

```bash
cd apps/www
pnpm install
pnpm dev
```

Runs on **http://localhost:3002** by default.

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Product app URL for Login / Get Started links (default `http://localhost:3000`) |
| `NEXT_PUBLIC_SITE_URL` | This site's public URL (optional) |
| `NEXT_PUBLIC_CMS_URL` | Future headless CMS for blog posts |

## Pages

| Route | Status |
|-------|--------|
| `/` | Homepage (ported from Zubaz CRM template, Modufy branding) |
| `/about` | About page |
| `/pricing` | Pricing |
| `/integrations` | Integrations grid |
| `/blog` | CMS placeholder |
| `/demo` | Demo request form |
| `/contact` | Contact form |
| `/privacy`, `/terms` | Legal placeholders |

## Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- Motion (Framer Motion) for scroll and hero animations
- Lucide icons

## Vercel

Create a third Vercel project with **Root Directory** = `apps/www`.
