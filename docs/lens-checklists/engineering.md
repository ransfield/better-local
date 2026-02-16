# Lens checklist: Engineering

Source: docs/engineering-standards.md

## Checklist

- [ ] Diff is small and reviewable; trade-offs are explicit when leaving SHOULD FIX items.
- [ ] External inputs are validated at the boundary (params, form data, webhook payloads).
- [ ] No secrets are committed (API keys, tokens, private app credentials, `.env`).
- [ ] Errors are handled explicitly; errors are not swallowed.
- [ ] Array/object access is guarded with optional chaining or explicit checks.
- [ ] Missing critical data triggers explicit error handling before use.
- [ ] Required env vars do not use defaults; missing values throw errors.
- [ ] Production paths use structured logging; no stray `console.log`.
- [ ] Tests cover breakable logic; bug fixes include regression coverage when practical.
- [ ] Avoid N+1 patterns and expensive hot-path work without caching/backoff.
