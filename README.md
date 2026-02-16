# Vercel Marketing Site Starter (Single Site)

A standardized Next.js + Tailwind + MDX starter for simple-but-polished marketing sites (3-5 pages + contact form).
Designed to be used as a **base repo** that you clone/fork per customer.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS (+ typography)
- MDX for rich content pages
- Contact form with server action (email via Resend)
- Optional Cloudflare Turnstile spam protection
- GitHub Actions: CI + "comment Preview URL on PR" helper (with Vercel Git integration)

## Quickstart

### Requirements
- Node 18+ (20+ recommended)
- pnpm

### Install
```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open http://localhost:3000

## New customer workflow
1. Create a new repo from this base (GitHub "Use this template" recommended).
2. Customize:
- `content/site.json` (business info, nav, SEO, contact email)
- `content/pages/*.mdx` (page content + blocks)
- `public/logo.svg`
3. Push to GitHub, import repo into Vercel, set env vars.

PRs generate Preview Deployments automatically in Vercel. Merge to `main` deploys production.

## Content structure

- `content/site.json` defines:
- business name, phone, address
- navigation links
- default SEO fields
- contact email destination
- `content/pages/*.mdx` each file becomes a route:
- `content/pages/about.mdx` -> `/about`
- `content/pages/services.mdx` -> `/services`

To add a new page:
1. Create `content/pages/faq.mdx`
2. Add `{ "label": "FAQ", "href": "/faq" }` to `content/site.json` nav
3. Done

## Contact form

The contact form is on `/contact` and uses a server action to send email.

### Required in production (Resend)
- `RESEND_API_KEY`
- `EMAIL_FROM` (verified sender/domain in Resend)
- `EMAIL_TO` (destination inbox)

### Optional spam protection (Cloudflare Turnstile)
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

If Turnstile env vars are missing, the form still works using honeypot checks only.

## Vercel Previews on PRs

If repo is connected to Vercel with Git integration:
- every PR gets a Preview Deployment
- `main` gets Production

This repo includes:
- `.github/workflows/vercel-preview-comment.yml`
- Listens for `deployment_status` and comments Preview URL on PR.

## Scripts
- `pnpm dev` - local dev
- `pnpm lint` - lint
- `pnpm typecheck` - TS check
- `pnpm build` - build
- `pnpm site:validate` - verify required content files
- `pnpm seo:check` - lightweight SEO/content guardrails
- `pnpm test:e2e` - Playwright smoke test (optional; runs in CI)

## Notes
- This starter is intentionally standardized; customize mainly via MDX content + block components.
- Keep changes in PRs and share Vercel Preview URLs for approval.
