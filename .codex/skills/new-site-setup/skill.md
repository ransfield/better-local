---
name: new-site-setup
description: Clone this marketing-site template repo, bootstrap a new client project, and create/push a new GitHub repo so the site is immediately ready to start. Use when asked to spin up a fresh client site from this template with local setup and repository creation.
---

# New Site Setup

Use the project bootstrap script for deterministic setup.

The script runs strict preflight checks automatically before cloning.

## Steps

1. Pick the target folder name for the new site.
2. Run:
```bash
./scripts/new-site-setup.sh [--wizard] <target-dir> [template-repo-url] [github-owner/repo-or-name]
```
3. Report:
- output folder path
- repo URL used
- GitHub repo created and pushed
- whether `pnpm site:validate` and `pnpm seo:check` passed
- whether preflight checks passed

## Defaults

- If `repo-url` is not provided, the script uses the current repo `origin` URL.
- If no `origin` is configured, it falls back to:
`https://github.com/ransfield/marketing-site-starter-template.git`
- By default it auto-creates a GitHub repo using `gh`.
- By default it also links/deploys to Vercel after repo creation (requires authenticated `vercel` CLI).
- Default owner fallback is `ransfield` unless `--owner`/`GH_OWNER` overrides it.
- `--profile personal|org` controls owner/repo behavior:
  - `personal` (default): owner optional; defaults to authenticated account.
  - `org`: requires `--owner`/`GH_OWNER` or explicit `owner/repo`.
- `--apply-content` with `--business-name`/`--phone`/`--site-url`/`--hero-title`... enables fully non-interactive content customization.
- `--wizard` interactively captures business details and updates `content/site.json` and `content/pages/home.mdx`.
- If `github-owner/repo-or-name` is omitted:
  - use `GH_OWNER/<target-dir>` when `GH_OWNER` is set
  - otherwise use `<target-dir>` under the authenticated GitHub account/org
- Branch defaults to `main` (override with `TEMPLATE_BRANCH=<branch>`).
- Use `--doctor` to run preflight checks only (no clone/setup).
- Use `--dry-run` to print planned actions without making changes.
- Use `--report <path>` to write a persistent setup summary into the generated repo.
- Use `--skip-install` and/or `--skip-checks` for fast setup when you explicitly want to defer local validation.
- Use `--reuse-repo` when rerunning setup against an existing GitHub repository.
- Use `--open-links` to open the GitHub repo and generated Vercel import link automatically.
- Vercel auto-link + deploy runs by default for GitHub-enabled flows; use `--no-vercel` to skip it.
- By default, partial target folders are cleaned up on failure; use `--no-cleanup` only when debugging.
- Required auth for full automation:
  - `gh auth login`
  - `vercel login`

## Examples

```bash
./scripts/new-site-setup.sh better-local-plumbing https://github.com/ransfield/marketing-site-starter-template.git ransfield/better-local-plumbing
```

```bash
./scripts/new-site-setup.sh --wizard better-local-electrical https://github.com/ransfield/marketing-site-starter-template.git ransfield/better-local-electrical
```

```bash
GH_OWNER=ransfield TEMPLATE_BRANCH=main ./scripts/new-site-setup.sh better-local-electrical
```

```bash
./scripts/new-site-setup.sh --profile org --owner ransfield better-local-electrical
```

```bash
./scripts/new-site-setup.sh --apply-content --business-name "Better Local Electrical" --contact-email "hello@betterlocalelectrical.com" better-local-electrical
```

```bash
CREATE_GITHUB_REPO=0 ./scripts/new-site-setup.sh better-local-demo
```

```bash
CREATE_GITHUB_REPO=0 ./scripts/new-site-setup.sh --doctor better-local-demo
```

```bash
./scripts/new-site-setup.sh --dry-run --profile org --owner ransfield better-local-demo
```

```bash
CREATE_GITHUB_REPO=0 ./scripts/new-site-setup.sh --report docs/setup-report.md better-local-demo
```

```bash
CREATE_GITHUB_REPO=0 ./scripts/new-site-setup.sh --skip-install --skip-checks better-local-demo
```

```bash
./scripts/new-site-setup.sh --reuse-repo --owner ransfield better-local-demo
```

```bash
./scripts/new-site-setup.sh --open-links --owner ransfield better-local-demo
```

```bash
./scripts/new-site-setup.sh --no-vercel better-local-demo
```

```bash
./scripts/new-site-setup.sh --no-cleanup better-local-demo
```
