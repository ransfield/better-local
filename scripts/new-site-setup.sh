#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  new-site-setup.sh [options] <target-dir> [template-repo-url] [github-owner/repo-or-name]

Examples:
  ./scripts/new-site-setup.sh my-client-site
  ./scripts/new-site-setup.sh my-client-site https://github.com/ransfield/marketing-site-starter-template.git ransfield/my-client-site
  ./scripts/new-site-setup.sh --wizard my-client-site

Options:
  --wizard              Prompt for project + content details interactively.
  --apply-content       Apply content values without using wizard prompts.
  --doctor              Run strict preflight checks and exit.
  --dry-run             Validate inputs and print planned actions only.
  --skip-install        Skip dependency installation (`pnpm install`).
  --skip-checks         Skip baseline validation (`pnpm site:validate`, `pnpm seo:check`).
  --no-cleanup          Do not remove partially-created target dir on failure.
  --no-github           Skip GitHub repo creation/push.
  --reuse-repo          If GitHub repo exists, reuse it and push instead of failing.
  --no-vercel           Skip automatic Vercel project link + deploy.
  --vercel-preview      Deploy preview instead of production.
  --vercel-scope <v>    Vercel team/account scope slug.
  --vercel-project <v>  Vercel project name or ID.
  --open-links          Open generated GitHub/Vercel links in your browser.
  --profile <value>     Setup profile: personal|org (default: personal).
  --visibility <value>  GitHub visibility: private|public|internal.
  --owner <value>       Default GitHub owner/user/org (used for repo naming).
  --report <path>       Write a setup summary report file in the target repo.
  --branch <value>      Template branch to clone (default: main).
  --business-name <v>   Business name for content/site.json + SEO defaults.
  --phone <v>           Business phone for content/site.json.
  --phone-raw <v>       Business phone in E.164 format.
  --address <v>         Business address (use \n for line breaks).
  --hours <v>           Business hours.
  --contact-email <v>   Contact destination email.
  --site-url <v>        Canonical site URL (e.g. https://example.com).
  --hero-title <v>      Home page hero title.
  --hero-subtitle <v>   Home page hero subtitle.
  --site-description <v> Default SEO description.
  -h, --help            Show this help.

Env flags:
  CREATE_GITHUB_REPO=0|1
  SETUP_PROFILE=personal|org
  DEFAULT_GH_OWNER=<owner>
  GITHUB_VISIBILITY=private|public|internal
  TEMPLATE_BRANCH=<branch>
  GH_OWNER=<owner>
  TEMPLATE_REMOTE_NAME=<name>
  GH_PUSH=0|1
  AUTO_VERCEL_DEPLOY=0|1
  VERCEL_PRODUCTION=0|1
  VERCEL_SCOPE=<scope>
  VERCEL_PROJECT=<name-or-id>
  VERCEL_TOKEN=<token>
  DRY_RUN=0|1
  INSTALL_DEPS=0|1
  RUN_BASELINE_CHECKS=0|1
USAGE
}

prompt_with_default() {
  local var_name="$1"
  local label="$2"
  local default_value="$3"
  local input=""

  read -r -p "${label} [${default_value}]: " input
  printf -v "$var_name" '%s' "${input:-$default_value}"
}

prompt_required() {
  local var_name="$1"
  local label="$2"
  local input=""

  while true; do
    read -r -p "${label}: " input
    if [[ -n "$input" ]]; then
      printf -v "$var_name" '%s' "$input"
      return
    fi
    echo "Value is required."
  done
}

TARGET_DIR="${TARGET_DIR:-}"
REPO_URL="${REPO_URL:-}"
GITHUB_REPO="${GITHUB_REPO:-}"

BRANCH="${TEMPLATE_BRANCH:-main}"
CREATE_GITHUB_REPO="${CREATE_GITHUB_REPO:-1}"
DEFAULT_GH_OWNER="${DEFAULT_GH_OWNER:-ransfield}"
GH_OWNER="${GH_OWNER:-${DEFAULT_GH_OWNER}}"
SETUP_PROFILE="${SETUP_PROFILE:-personal}"
GITHUB_VISIBILITY="${GITHUB_VISIBILITY:-private}"
TEMPLATE_REMOTE_NAME="${TEMPLATE_REMOTE_NAME:-template}"
GH_PUSH="${GH_PUSH:-1}"
AUTO_VERCEL_DEPLOY="${AUTO_VERCEL_DEPLOY:-1}"
VERCEL_PRODUCTION="${VERCEL_PRODUCTION:-1}"
VERCEL_SCOPE="${VERCEL_SCOPE:-}"
VERCEL_PROJECT="${VERCEL_PROJECT:-}"
WIZARD="${WIZARD:-0}"
WIZARD_APPLY_CONTENT="${WIZARD_APPLY_CONTENT:-1}"
APPLY_CONTENT="${APPLY_CONTENT:-0}"
DOCTOR_ONLY="${DOCTOR_ONLY:-0}"
DRY_RUN="${DRY_RUN:-0}"
REPORT_PATH="${REPORT_PATH:-}"
INSTALL_DEPS="${INSTALL_DEPS:-1}"
RUN_BASELINE_CHECKS="${RUN_BASELINE_CHECKS:-1}"
REUSE_GITHUB_REPO="${REUSE_GITHUB_REPO:-0}"
OPEN_LINKS="${OPEN_LINKS:-0}"
CLEANUP_ON_FAIL="${CLEANUP_ON_FAIL:-1}"
TARGET_PATH_ABS=""
CLONED_TARGET=0

say_ok() {
  printf 'OK: %s\n' "$1"
}

say_fail() {
  printf 'FAIL: %s\n' "$1"
}

open_url() {
  local url="$1"

  if command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  fi
}

run_vercel() {
  local args=("$@")
  if [[ -n "${VERCEL_SCOPE}" ]]; then
    args+=(--scope "${VERCEL_SCOPE}")
  fi
  if [[ -n "${VERCEL_TOKEN:-}" ]]; then
    args+=(--token "${VERCEL_TOKEN}")
  fi
  vercel "${args[@]}"
}

cleanup_on_exit() {
  local exit_code="$?"

  if [[ "$exit_code" -ne 0 && "${CLEANUP_ON_FAIL}" == "1" && "${CLONED_TARGET}" == "1" && -n "${TARGET_PATH_ABS}" && -d "${TARGET_PATH_ABS}" ]]; then
    echo "Setup failed; cleaning up partial target: ${TARGET_PATH_ABS}"
    rm -rf "${TARGET_PATH_ABS}"
  fi
}

run_preflight() {
  local failed=0
  local node_major=""
  local template_probe=""
  local target_path=""

  target_path="$TARGET_DIR"
  if [[ "$target_path" != /* ]]; then
    target_path="$(pwd)/$target_path"
  fi

  echo
  echo "Running preflight checks..."

  if command -v git >/dev/null 2>&1; then
    say_ok "git is installed"
  else
    say_fail "git is required"
    failed=1
  fi

  if [[ "${INSTALL_DEPS}" == "1" || "${RUN_BASELINE_CHECKS}" == "1" ]]; then
    if command -v pnpm >/dev/null 2>&1; then
      say_ok "pnpm is installed"
    else
      say_fail "pnpm is required when install/checks are enabled"
      failed=1
    fi
  else
    say_ok "pnpm check skipped (install/checks disabled)"
  fi

  if command -v node >/dev/null 2>&1; then
    node_major="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
    if [[ "$node_major" =~ ^[0-9]+$ ]] && (( node_major >= 18 )); then
      say_ok "Node.js version is $(node -v) (>=18)"
    else
      say_fail "Node.js 18+ is required (found $(node -v))"
      failed=1
    fi
  else
    say_fail "node is required"
    failed=1
  fi

  if [[ -e "$target_path" ]]; then
    say_fail "target path already exists: $target_path"
    failed=1
  else
    say_ok "target path is available: $target_path"
  fi

  if [[ "${GITHUB_VISIBILITY}" == "private" || "${GITHUB_VISIBILITY}" == "public" || "${GITHUB_VISIBILITY}" == "internal" ]]; then
    say_ok "GitHub visibility is valid: ${GITHUB_VISIBILITY}"
  else
    say_fail "GITHUB_VISIBILITY must be one of: private, public, internal"
    failed=1
  fi

  if [[ "${SETUP_PROFILE}" == "personal" || "${SETUP_PROFILE}" == "org" ]]; then
    say_ok "Setup profile is valid: ${SETUP_PROFILE}"
  else
    say_fail "SETUP_PROFILE must be one of: personal, org"
    failed=1
  fi

  if [[ "${SETUP_PROFILE}" == "org" && "${CREATE_GITHUB_REPO}" == "1" ]]; then
    if [[ -n "${GH_OWNER:-}" ]]; then
      say_ok "GitHub owner is set for org profile: ${GH_OWNER}"
    elif [[ "${GITHUB_REPO}" == */* ]]; then
      say_ok "GitHub repo includes explicit owner for org profile: ${GITHUB_REPO}"
    else
      say_fail "Org profile requires --owner/ GH_OWNER or an explicit owner/repo argument"
      failed=1
    fi
  fi

  if command -v git >/dev/null 2>&1; then
    template_probe="$(git ls-remote --heads "${REPO_URL}" "${BRANCH}" 2>/dev/null || true)"
    if [[ -n "${template_probe}" ]]; then
      say_ok "Template branch is reachable: ${REPO_URL}#${BRANCH}"
    else
      say_fail "Cannot resolve template branch: ${REPO_URL}#${BRANCH}"
      failed=1
    fi
  fi

  if [[ "${CREATE_GITHUB_REPO}" == "1" ]]; then
    if command -v gh >/dev/null 2>&1; then
      say_ok "gh is installed"
      if gh auth status -h github.com >/dev/null 2>&1; then
        say_ok "gh is authenticated for github.com"
      else
        say_fail "gh is not authenticated. Run: gh auth login"
        failed=1
      fi
    else
      say_fail "gh is required when CREATE_GITHUB_REPO=1"
      failed=1
    fi
  else
    say_ok "GitHub repo creation is disabled"
  fi

  if [[ "${AUTO_VERCEL_DEPLOY}" == "1" ]]; then
    if [[ "${CREATE_GITHUB_REPO}" != "1" ]]; then
      say_fail "AUTO_VERCEL_DEPLOY=1 requires GitHub repo creation enabled"
      failed=1
    fi

    if command -v vercel >/dev/null 2>&1; then
      say_ok "vercel CLI is installed"
      if run_vercel whoami >/dev/null 2>&1; then
        say_ok "vercel CLI is authenticated"
      else
        say_fail "vercel CLI is not authenticated. Run: vercel login"
        failed=1
      fi
    else
      say_fail "vercel CLI is required when AUTO_VERCEL_DEPLOY=1"
      failed=1
    fi
  else
    say_ok "Automatic Vercel deploy is disabled"
  fi

  if [[ "$failed" -ne 0 ]]; then
    echo
    echo "Preflight failed."
    return 1
  fi

  echo
  echo "Preflight passed."
}

POSITIONAL=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --wizard)
      WIZARD=1
      shift
      ;;
    --doctor)
      DOCTOR_ONLY=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --skip-install)
      INSTALL_DEPS=0
      shift
      ;;
    --skip-checks)
      RUN_BASELINE_CHECKS=0
      shift
      ;;
    --no-cleanup)
      CLEANUP_ON_FAIL=0
      shift
      ;;
    --apply-content)
      APPLY_CONTENT=1
      shift
      ;;
    --no-github)
      CREATE_GITHUB_REPO=0
      shift
      ;;
    --reuse-repo)
      REUSE_GITHUB_REPO=1
      shift
      ;;
    --no-vercel)
      AUTO_VERCEL_DEPLOY=0
      shift
      ;;
    --vercel-preview)
      VERCEL_PRODUCTION=0
      shift
      ;;
    --vercel-scope)
      VERCEL_SCOPE="${2:-}"
      shift 2
      ;;
    --vercel-project)
      VERCEL_PROJECT="${2:-}"
      shift 2
      ;;
    --open-links)
      OPEN_LINKS=1
      shift
      ;;
    --profile)
      SETUP_PROFILE="${2:-}"
      shift 2
      ;;
    --visibility)
      GITHUB_VISIBILITY="${2:-}"
      shift 2
      ;;
    --owner)
      GH_OWNER="${2:-}"
      shift 2
      ;;
    --report)
      REPORT_PATH="${2:-}"
      shift 2
      ;;
    --branch)
      BRANCH="${2:-}"
      shift 2
      ;;
    --business-name)
      WIZARD_BUSINESS_NAME="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --phone)
      WIZARD_PHONE="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --phone-raw)
      WIZARD_PHONE_RAW="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --address)
      WIZARD_ADDRESS="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --hours)
      WIZARD_HOURS="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --contact-email)
      WIZARD_CONTACT_EMAIL="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --site-url)
      WIZARD_SITE_URL="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --hero-title)
      WIZARD_HERO_TITLE="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --hero-subtitle)
      WIZARD_HERO_SUBTITLE="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    --site-description)
      WIZARD_SITE_DESCRIPTION="${2:-}"
      APPLY_CONTENT=1
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      POSITIONAL+=("$1")
      shift
      ;;
  esac
done

if [[ ${#POSITIONAL[@]} -ge 1 && -z "$TARGET_DIR" ]]; then
  TARGET_DIR="${POSITIONAL[0]}"
fi
if [[ ${#POSITIONAL[@]} -ge 2 && -z "$REPO_URL" ]]; then
  REPO_URL="${POSITIONAL[1]}"
fi
if [[ ${#POSITIONAL[@]} -ge 3 && -z "$GITHUB_REPO" ]]; then
  GITHUB_REPO="${POSITIONAL[2]}"
fi

DEFAULT_TEMPLATE_REPO="https://github.com/ransfield/marketing-site-starter-template.git"
if [[ -z "${REPO_URL}" ]]; then
  REPO_URL="${DEFAULT_TEMPLATE_REPO}"
fi

if [[ "${WIZARD}" == "1" ]]; then
  echo
  echo "Interactive setup wizard"
  echo

  if [[ -z "${TARGET_DIR}" ]]; then
    prompt_required TARGET_DIR "Target folder name"
  fi

  prompt_with_default REPO_URL "Template repo URL" "${REPO_URL}"

  if [[ "${CREATE_GITHUB_REPO}" == "1" ]]; then
    prompt_with_default SETUP_PROFILE "Setup profile (personal|org)" "${SETUP_PROFILE}"
    if [[ "${SETUP_PROFILE}" == "org" ]]; then
      prompt_required GH_OWNER "GitHub org owner"
    else
      prompt_with_default GH_OWNER "Default GitHub owner (optional)" "${GH_OWNER:-}"
    fi

    default_repo_name="$(basename "${TARGET_DIR}")"
    if [[ -n "${GH_OWNER:-}" ]]; then
      default_repo_name="${GH_OWNER}/${default_repo_name}"
    fi
    prompt_with_default GITHUB_REPO "GitHub repo (owner/name or name)" "${GITHUB_REPO:-$default_repo_name}"
    prompt_with_default GITHUB_VISIBILITY "GitHub visibility" "${GITHUB_VISIBILITY}"
  fi

  read -r -p "Apply starter content customization? [yes]: " wizard_apply
  wizard_apply="${wizard_apply:-yes}"
  if [[ "${wizard_apply}" =~ ^[Nn]([Oo])?$ ]]; then
    WIZARD_APPLY_CONTENT=0
  else
    WIZARD_APPLY_CONTENT=1
  fi

  if [[ "${WIZARD_APPLY_CONTENT}" == "1" ]]; then
    APPLY_CONTENT=1
    prompt_with_default WIZARD_BUSINESS_NAME "Business name" "Demo Local Business"
    prompt_with_default WIZARD_PHONE "Business phone" "(555) 123-4567"
    prompt_with_default WIZARD_PHONE_RAW "Business phone raw (E.164)" "+15551234567"
    prompt_with_default WIZARD_ADDRESS "Business address (use \\n for line breaks)" "123 Main Street\\nYourtown, ST 12345"
    prompt_with_default WIZARD_HOURS "Business hours" "Mon-Fri 8am-6pm"
    prompt_with_default WIZARD_CONTACT_EMAIL "Contact email" "hello@example.com"
    prompt_with_default WIZARD_SITE_URL "Site URL" "https://example.com"
    prompt_with_default WIZARD_HERO_TITLE "Home hero title" "High-quality work, clear pricing, and fast scheduling."
    prompt_with_default WIZARD_HERO_SUBTITLE "Home hero subtitle" "Use this starter to build polished 3-5 page sites quickly. Edit content in MDX, reuse blocks, and ship via Vercel previews."

    default_desc="${WIZARD_BUSINESS_NAME} provides reliable local services with clear pricing and fast scheduling."
    prompt_with_default WIZARD_SITE_DESCRIPTION "Default SEO description" "${default_desc}"
  fi
fi

if [[ -z "${TARGET_DIR}" ]]; then
  usage
  exit 1
fi

if [[ -e "${TARGET_DIR}" ]]; then
  echo "Target '${TARGET_DIR}' already exists. Choose a new folder name or remove it first."
  exit 1
fi

if [[ "${GITHUB_VISIBILITY}" != "private" && "${GITHUB_VISIBILITY}" != "public" && "${GITHUB_VISIBILITY}" != "internal" ]]; then
  echo "GITHUB_VISIBILITY must be one of: private, public, internal."
  exit 1
fi

if [[ "${SETUP_PROFILE}" != "personal" && "${SETUP_PROFILE}" != "org" ]]; then
  echo "SETUP_PROFILE must be one of: personal, org."
  exit 1
fi

# Local-only flows should not require Vercel auto-deploy defaults.
if [[ "${CREATE_GITHUB_REPO}" != "1" && "${AUTO_VERCEL_DEPLOY}" == "1" ]]; then
  AUTO_VERCEL_DEPLOY=0
fi

if [[ "${TARGET_DIR}" == /* ]]; then
  TARGET_PATH_ABS="${TARGET_DIR}"
else
  TARGET_PATH_ABS="$(pwd)/${TARGET_DIR}"
fi

trap cleanup_on_exit EXIT

run_preflight

if [[ "${DOCTOR_ONLY}" == "1" ]]; then
  exit 0
fi

if [[ "${DRY_RUN}" == "1" ]]; then
  echo
  echo "Dry run summary:"
  echo "  - target: ${TARGET_DIR}"
  echo "  - template: ${REPO_URL}#${BRANCH}"
  echo "  - profile: ${SETUP_PROFILE}"
  echo "  - create GitHub repo: ${CREATE_GITHUB_REPO}"
  echo "  - apply content customization: ${APPLY_CONTENT}"
  echo "  - install dependencies: ${INSTALL_DEPS}"
  echo "  - run baseline checks: ${RUN_BASELINE_CHECKS}"
  echo "  - cleanup on failure: ${CLEANUP_ON_FAIL}"
  echo "  - auto Vercel deploy: ${AUTO_VERCEL_DEPLOY}"
  if [[ "${CREATE_GITHUB_REPO}" == "1" ]]; then
    echo "  - repo visibility: ${GITHUB_VISIBILITY}"
    echo "  - default owner: ${GH_OWNER:-<none>}"
    echo "  - requested repo: ${GITHUB_REPO:-<auto>}"
    echo "  - reuse repo if exists: ${REUSE_GITHUB_REPO}"
    echo "  - open links: ${OPEN_LINKS}"
  fi
  if [[ "${AUTO_VERCEL_DEPLOY}" == "1" ]]; then
    echo "  - vercel production deploy: ${VERCEL_PRODUCTION}"
    echo "  - vercel project: ${VERCEL_PROJECT:-<auto>}"
    echo "  - vercel scope: ${VERCEL_SCOPE:-<default>}"
  fi
  if [[ -n "${REPORT_PATH}" ]]; then
    echo "  - report path: ${REPORT_PATH}"
  fi
  echo
  echo "No changes made (dry run)."
  exit 0
fi

echo "Cloning '${REPO_URL}' (branch: ${BRANCH}) into '${TARGET_DIR}'..."
git clone --branch "${BRANCH}" --single-branch "${REPO_URL}" "${TARGET_DIR}"
CLONED_TARGET=1

cd "${TARGET_DIR}"

if [[ "${APPLY_CONTENT}" == "1" ]]; then
  WIZARD_BUSINESS_NAME="${WIZARD_BUSINESS_NAME:-Demo Local Business}" \
  WIZARD_PHONE="${WIZARD_PHONE:-'(555) 123-4567'}" \
  WIZARD_PHONE_RAW="${WIZARD_PHONE_RAW:-+15551234567}" \
  WIZARD_ADDRESS="${WIZARD_ADDRESS:-123 Main Street\\nYourtown, ST 12345}" \
  WIZARD_HOURS="${WIZARD_HOURS:-Mon-Fri 8am-6pm}" \
  WIZARD_CONTACT_EMAIL="${WIZARD_CONTACT_EMAIL:-hello@example.com}" \
  WIZARD_SITE_URL="${WIZARD_SITE_URL:-https://example.com}" \
  WIZARD_HERO_TITLE="${WIZARD_HERO_TITLE:-High-quality work, clear pricing, and fast scheduling.}" \
  WIZARD_HERO_SUBTITLE="${WIZARD_HERO_SUBTITLE:-Use this starter to build polished 3-5 page sites quickly. Edit content in MDX, reuse blocks, and ship via Vercel previews.}" \
  WIZARD_SITE_DESCRIPTION="${WIZARD_SITE_DESCRIPTION:-}" \
  node <<'EOF_NODE'
const fs = require('node:fs')
const path = require('node:path')

function unescapeNewlines(value) {
  return String(value || '').replace(/\\n/g, '\n')
}

function escapeMdxAttr(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
}

const sitePath = path.join(process.cwd(), 'content', 'site.json')
const homePath = path.join(process.cwd(), 'content', 'pages', 'home.mdx')

const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'))
site.business.name = process.env.WIZARD_BUSINESS_NAME || site.business.name
site.business.phone = process.env.WIZARD_PHONE || site.business.phone
site.business.phoneRaw = process.env.WIZARD_PHONE_RAW || site.business.phoneRaw
site.business.address = unescapeNewlines(process.env.WIZARD_ADDRESS || site.business.address)
site.business.hours = process.env.WIZARD_HOURS || site.business.hours
site.contact.toEmail = process.env.WIZARD_CONTACT_EMAIL || site.contact.toEmail
site.seo.siteUrl = process.env.WIZARD_SITE_URL || site.seo.siteUrl
site.seo.defaultTitle = process.env.WIZARD_BUSINESS_NAME || site.seo.defaultTitle
site.seo.defaultDescription = process.env.WIZARD_SITE_DESCRIPTION || site.seo.defaultDescription

fs.writeFileSync(sitePath, JSON.stringify(site, null, 2) + '\n')

let home = fs.readFileSync(homePath, 'utf8')
home = home.replace(/title="[^"]*"/, `title="${escapeMdxAttr(process.env.WIZARD_HERO_TITLE)}"`)
home = home.replace(/subtitle="[^"]*"/, `subtitle="${escapeMdxAttr(process.env.WIZARD_HERO_SUBTITLE)}"`)
fs.writeFileSync(homePath, home)
EOF_NODE
fi

if [[ -f ".env.example" && ! -f ".env.local" ]]; then
  cp .env.example .env.local
fi

if [[ "${INSTALL_DEPS}" == "1" ]]; then
  echo "Installing dependencies..."
  pnpm install
else
  echo "Skipping dependency install (--skip-install)."
fi

if [[ "${RUN_BASELINE_CHECKS}" == "1" ]]; then
  echo "Running baseline validation..."
  pnpm site:validate
  pnpm seo:check
else
  echo "Skipping baseline validation (--skip-checks)."
fi

if [[ "${CREATE_GITHUB_REPO}" == "1" ]]; then
  if ! command -v gh >/dev/null 2>&1; then
    echo "GitHub CLI (gh) is required to auto-create the new repo."
    echo "Install gh or rerun with CREATE_GITHUB_REPO=0."
    exit 1
  fi

  if ! gh auth status -h github.com >/dev/null 2>&1; then
    echo "GitHub CLI is not authenticated. Run: gh auth login"
    exit 1
  fi

  TEMPLATE_REMOTE_URL="$(git remote get-url origin)"
  if [[ "${TEMPLATE_REMOTE_NAME}" != "origin" ]]; then
    if git remote | grep -qx "${TEMPLATE_REMOTE_NAME}"; then
      echo "Remote name '${TEMPLATE_REMOTE_NAME}' already exists."
      exit 1
    fi
    git remote rename origin "${TEMPLATE_REMOTE_NAME}"
  fi

  if [[ -z "${GITHUB_REPO}" ]]; then
    BASE_NAME="$(basename "${TARGET_DIR}")"
    if [[ -n "${GH_OWNER:-}" ]]; then
      GITHUB_REPO="${GH_OWNER}/${BASE_NAME}"
    elif [[ "${SETUP_PROFILE}" == "org" ]]; then
      echo "Org profile requires --owner/ GH_OWNER or an explicit owner/repo argument."
      exit 1
    else
      GITHUB_REPO="${BASE_NAME}"
    fi
  elif [[ "${GITHUB_REPO}" != */* && -n "${GH_OWNER:-}" ]]; then
    GITHUB_REPO="${GH_OWNER}/${GITHUB_REPO}"
  elif [[ "${GITHUB_REPO}" != */* && "${SETUP_PROFILE}" == "org" ]]; then
    echo "Org profile requires owner/repo format or --owner/ GH_OWNER."
    exit 1
  fi

  echo "Creating GitHub repo '${GITHUB_REPO}' (${GITHUB_VISIBILITY})..."
  if gh repo view "${GITHUB_REPO}" --json url -q .url >/dev/null 2>&1; then
    if [[ "${REUSE_GITHUB_REPO}" != "1" ]]; then
      echo "GitHub repo '${GITHUB_REPO}' already exists."
      echo "Re-run with --reuse-repo to push to the existing repository."
      exit 1
    fi

    GH_URL="$(gh repo view "${GITHUB_REPO}" --json url -q .url)"
    git remote add origin "${GH_URL}"
    git push -u origin "$(git branch --show-current)"
  else
    if [[ "${GH_PUSH}" == "1" ]]; then
      gh repo create "${GITHUB_REPO}" "--${GITHUB_VISIBILITY}" --source=. --remote=origin --push
    else
      gh repo create "${GITHUB_REPO}" "--${GITHUB_VISIBILITY}" --source=. --remote=origin
      git push -u origin "$(git branch --show-current)"
    fi
    GH_URL="$(gh repo view "${GITHUB_REPO}" --json url -q .url 2>/dev/null || true)"
  fi

  GH_URL="${GH_URL:-$(gh repo view "${GITHUB_REPO}" --json url -q .url 2>/dev/null || true)}"
fi

if [[ -n "${GH_URL:-}" ]]; then
  CLEAN_GH_URL="${GH_URL%.git}"
  VERCEL_IMPORT_URL="https://vercel.com/new/clone?repository-url=${CLEAN_GH_URL}"
fi

if [[ "${AUTO_VERCEL_DEPLOY}" == "1" ]]; then
  if [[ -z "${VERCEL_PROJECT}" ]]; then
    if [[ -n "${GITHUB_REPO:-}" ]]; then
      VERCEL_PROJECT="${GITHUB_REPO##*/}"
    else
      VERCEL_PROJECT="$(basename "${TARGET_DIR}")"
    fi
  fi

  echo "Linking Vercel project '${VERCEL_PROJECT}'..."
  run_vercel link --yes --project "${VERCEL_PROJECT}"

  echo "Connecting Git repository to Vercel project..."
  ORIGIN_GIT_URL="$(git remote get-url origin)"
  run_vercel git connect "${ORIGIN_GIT_URL}" --yes

  if [[ "${VERCEL_PRODUCTION}" == "1" ]]; then
    echo "Deploying production build to Vercel..."
    VERCEL_DEPLOYMENT_URL="$(run_vercel --prod --yes | tail -n 1)"
  else
    echo "Deploying preview build to Vercel..."
    VERCEL_DEPLOYMENT_URL="$(run_vercel --yes | tail -n 1)"
  fi
fi

if [[ -n "${REPORT_PATH}" ]]; then
  mkdir -p "$(dirname "${REPORT_PATH}")"
  cat > "${REPORT_PATH}" <<EOF_REPORT
# New Site Setup Report

- Generated at: $(date -u '+%Y-%m-%d %H:%M:%S UTC')
- Target directory: ${TARGET_DIR}
- Template source: ${REPO_URL}#${BRANCH}
- Setup profile: ${SETUP_PROFILE}
- Content customization applied: ${APPLY_CONTENT}
- Baseline checks: \`pnpm site:validate\`, \`pnpm seo:check\`

## Repository

- GitHub repo creation enabled: ${CREATE_GITHUB_REPO}
- GitHub visibility: ${GITHUB_VISIBILITY}
- Origin URL: ${GH_URL:-<not-created>}

## Vercel

- Automatic Vercel deploy enabled: ${AUTO_VERCEL_DEPLOY}
- Vercel project: ${VERCEL_PROJECT:-<not-set>}
- Deployment URL: ${VERCEL_DEPLOYMENT_URL:-<not-deployed>}

## Next Steps

1. Run \`pnpm dev\`.
2. Update \`content/site.json\`, \`content/pages/*.mdx\`, and \`public/logo.svg\`.
3. Add production env vars in Vercel:
   - \`RESEND_API_KEY\`
   - \`EMAIL_FROM\`
   - \`EMAIL_TO\`
   - optional: \`NEXT_PUBLIC_TURNSTILE_SITE_KEY\`, \`TURNSTILE_SECRET_KEY\`
4. Push changes and open a PR to trigger a Vercel Preview deployment.
EOF_REPORT
fi

echo
echo "New site is ready at: ${TARGET_DIR}"
echo "Next steps:"
echo "  cd ${TARGET_DIR}"
echo "  pnpm dev"
echo
echo "Then edit:"
echo "  - content/site.json"
echo "  - content/pages/*.mdx"
echo "  - public/logo.svg"

if [[ "${CREATE_GITHUB_REPO}" == "1" ]]; then
  echo
  echo "Git remotes:"
  echo "  - origin: ${GH_URL:-${GITHUB_REPO}}"
  echo "  - ${TEMPLATE_REMOTE_NAME}: ${TEMPLATE_REMOTE_URL}"
fi

if [[ -n "${VERCEL_IMPORT_URL:-}" ]]; then
  echo
  echo "Vercel import:"
  echo "  - ${VERCEL_IMPORT_URL}"
fi

if [[ -n "${VERCEL_DEPLOYMENT_URL:-}" ]]; then
  echo
  echo "Vercel deployment:"
  echo "  - ${VERCEL_DEPLOYMENT_URL}"
fi

if [[ -n "${REPORT_PATH}" ]]; then
  echo
  echo "Setup report:"
  echo "  - ${TARGET_DIR}/${REPORT_PATH}"
fi

if [[ "${OPEN_LINKS}" == "1" ]]; then
  [[ -n "${GH_URL:-}" ]] && open_url "${GH_URL}"
  [[ -n "${VERCEL_IMPORT_URL:-}" ]] && open_url "${VERCEL_IMPORT_URL}"
  [[ -n "${VERCEL_DEPLOYMENT_URL:-}" ]] && open_url "${VERCEL_DEPLOYMENT_URL}"
fi
