# Agent Operating Guide (Marketing Site Starter)

This file is instructions for automated coding agents and humans.

## Working agreement (non-negotiable)

When you make changes in this repo, you MUST follow this loop before you say you are done:

1. Run `./scripts/opencode-review.sh`
2. Fix any failures
3. Repeat until `./scripts/opencode-review.sh` exits 0

If OpenCode returns FAIL, treat it like a blocking CI failure.

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
- `pnpm seo:check`
- `pnpm build`
- `pnpm test:e2e` (if configured)

## PR expectations
- Keep PRs small and focused.
- Include review checklist:
- pages changed
- what to click/verify
- contact form behavior

## Agent review standards
- Review checklists live in `docs/lens-checklists/*`.
- Use Codex skill `$opencode-review` for a fast standard review pass.
- If in a Ralph loop, read `.ralph/feedback.md` first and make it pass.
- If `.git` is missing/unwritable, report the blocker and continue with manual checks.

## Vercel Skills
- These skills are required for this project and must be used as part of PR automation and quality checks.
- `vercel-react-best-practices`:
- Use for any component/page/refactor work to keep React and Next.js implementation aligned with Vercel standards.
- `web-design-guidelines`:
- Use when updating layout, styling, typography, blocks, or responsive behavior to maintain UI consistency and accessibility.
- `agent-browser`:
- Use during preview testing and smoke checks to verify key routes, forms, and user-visible behavior in deployed/preview environments.
- `seo-audit`:
- Use for content, metadata, headings, and page-structure changes to validate SEO quality before merge.
- Rationale:
- This set enforces implementation best practices, protects design/system consistency, supports automated browser-level verification, and adds SEO guardrails for client-facing updates.
