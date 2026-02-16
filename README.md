# BetterLocal Website

BetterLocal is a marketing website for a service business that helps local businesses launch practical websites quickly.

This repo is a single Next.js marketing storefront (not multi-tenant/SaaS).

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- MDX content pages
- Contact form server action (Resend + optional Turnstile)

## Key places to customize
- `content/site.json`:
  business details, nav, SEO defaults, contact email destination
- `content/pages/*.mdx`:
  all page content and layout blocks
- `public/logo.svg`:
  site logo/wordmark

## Local run
```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000

## Checks
```bash
pnpm lint
pnpm typecheck
pnpm site:validate
pnpm seo:check
pnpm build
pnpm test:e2e
```

## Contact form env vars
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (optional)
- `TURNSTILE_SECRET_KEY` (optional)
