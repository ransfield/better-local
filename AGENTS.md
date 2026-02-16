# Agent Operating Guide (Marketing Site Starter)

This file is instructions for automated coding agents and humans.

## Primary goal

Make fast, safe updates to a marketing site without breaking:
- layout/navigation
- SEO basics
- contact form delivery
- performance/accessibility

## Safe to edit
- `content/site.json` (business details, nav, SEO, contact email)
- `content/pages/*.mdx` (page content)
- `public/logo.svg` and other images
- `components/blocks/*` (reusable layout blocks)
- `components/ui/*` (small UI primitives)

Avoid unnecessary changes to build tooling/configs and server action email code unless required.

## Conventions
- One H1 per page.
- Use semantic heading order.
- Prefer server components by default; use `"use client"` only when needed.
- Images must include alt text (or empty alt only if decorative).

## Contact form rules
- Never commit secrets or API keys.
- No logging of full message contents or PII in production logs.
- If `RESEND_API_KEY` is missing, local dev should still return a friendly not-configured message.
- Turnstile is optional; if keys exist, verify token server-side.

## Pre-PR checklist
- `pnpm lint`
- `pnpm typecheck`
- `pnpm site:validate`
- `pnpm build`
- `pnpm test:e2e` (if configured)

## PR expectations
- Keep PRs small and focused.
- Include review checklist:
- pages changed
- what to click/verify
- contact form behavior
