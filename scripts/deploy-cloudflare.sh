#!/usr/bin/env bash
#
# deploy-cloudflare.sh — one-shot, idempotent deployment of Ask-Yael to
# Cloudflare Pages, with the D1 database, KV cache, migrations, secrets, and an
# optional demo seed. Safe to run repeatedly: it provisions anything missing and
# reuses what already exists.
#
# Usage:
#   scripts/deploy-cloudflare.sh [options]
#
# Options:
#   --project NAME     Pages project name          (default: ask-yael)
#   --db NAME          D1 database name             (default: ask-yael-db)
#   --kv NAME          KV namespace binding title   (default: ask-yael-cache)
#   --branch NAME      Production branch            (default: main)
#   --seed             Seed demo call records after deploy
#   --skip-tests       Skip `npm test`
#   --skip-build       Reuse an existing ./dist
#   -h, --help         Show this help
#
# Auth (for CI / non-interactive): export CLOUDFLARE_API_TOKEN and
# CLOUDFLARE_ACCOUNT_ID. Locally, `wrangler login` works too.
#
# Secrets: any of these present in the environment are pushed to the Pages
# project as encrypted secrets:
#   ELEVENLABS_API_KEY ELEVENLABS_VOICE_HE ELEVENLABS_VOICE_FR ELEVENLABS_VOICE_EN
#   DENTAL_PMS_BASE_URL DENTAL_PMS_API_KEY DENTAL_PMS_PROVIDER_ID DENTAL_PMS_OPERATORY_ID
#   TELEPHONY_PHONE_NUMBER SEED_TOKEN
set -euo pipefail

# --- config / defaults ------------------------------------------------------
PROJECT="ask-yael"
DB_NAME="ask-yael-db"
KV_TITLE="ask-yael-cache"
BRANCH="main"
DO_SEED=0
SKIP_TESTS=0
SKIP_BUILD=0

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
WRANGLER_TOML="$REPO_ROOT/wrangler.toml"

WRANGLER=(npx --yes wrangler@^3.114.17)

log()  { printf '\033[1;34m▸ %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# --- args -------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) PROJECT="$2"; shift 2;;
    --db)      DB_NAME="$2"; shift 2;;
    --kv)      KV_TITLE="$2"; shift 2;;
    --branch)  BRANCH="$2"; shift 2;;
    --seed)        DO_SEED=1; shift;;
    --skip-tests)  SKIP_TESTS=1; shift;;
    --skip-build)  SKIP_BUILD=1; shift;;
    -h|--help) sed -n '2,40p' "$0" | sed 's/^# \{0,1\}//'; exit 0;;
    *) die "unknown option: $1 (try --help)";;
  esac
done

# --- preflight --------------------------------------------------------------
command -v node >/dev/null || die "node is required"
command -v npm  >/dev/null || die "npm is required"
if [[ -z "${CLOUDFLARE_API_TOKEN:-}" && -z "${CF_API_TOKEN:-}" ]]; then
  warn "CLOUDFLARE_API_TOKEN not set — relying on an interactive \`wrangler login\` session."
fi

# jq-free JSON field extraction via node.
json_field() { node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);process.stdout.write(String(eval("j"+process.argv[1])??""))}catch{process.stdout.write("")}})' "$1"; }

# --- 1. install -------------------------------------------------------------
log "Installing dependencies"
if [[ -f package-lock.json ]]; then npm ci; else npm install; fi
ok "Dependencies ready"

# --- 2. test ----------------------------------------------------------------
if [[ "$SKIP_TESTS" -eq 0 ]]; then
  log "Running tests"
  npm test
  ok "Tests passed"
else
  warn "Skipping tests (--skip-tests)"
fi

# --- 3. build ---------------------------------------------------------------
if [[ "$SKIP_BUILD" -eq 0 ]]; then
  log "Building static site"
  npm run build
  ok "Built ./dist"
else
  [[ -d dist ]] || die "--skip-build set but ./dist does not exist"
  warn "Skipping build (--skip-build), reusing ./dist"
fi

# --- 4. D1 database ---------------------------------------------------------
log "Ensuring D1 database '$DB_NAME'"
DB_ID="$("${WRANGLER[@]}" d1 list --json 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);const m=a.find(x=>x.name===process.argv[1]);process.stdout.write(m?m.uuid:"")}catch{process.stdout.write("")}})' "$DB_NAME" || true)"
if [[ -z "$DB_ID" ]]; then
  log "Creating D1 database '$DB_NAME'"
  CREATE_OUT="$("${WRANGLER[@]}" d1 create "$DB_NAME" 2>&1 || true)"
  echo "$CREATE_OUT"
  DB_ID="$(printf '%s' "$CREATE_OUT" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -n1 || true)"
fi
[[ -n "$DB_ID" ]] || die "could not determine D1 database id for '$DB_NAME'"
ok "D1 database id: $DB_ID"

# Patch database_id into wrangler.toml (idempotent).
node - "$WRANGLER_TOML" "$DB_ID" <<'NODE'
const fs = require("fs");
const [file, id] = process.argv.slice(2);
let t = fs.readFileSync(file, "utf8");
t = t.replace(/database_id\s*=\s*"[^"]*"/, `database_id = "${id}"`);
fs.writeFileSync(file, t);
NODE
ok "wrangler.toml database_id updated"

# --- 5. KV namespace --------------------------------------------------------
log "Ensuring KV namespace '$KV_TITLE'"
KV_ID="$("${WRANGLER[@]}" kv namespace list 2>/dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);const m=a.find(x=>x.title===process.argv[1]||x.title===("ask-yael-"+process.argv[1]));process.stdout.write(m?m.id:"")}catch{process.stdout.write("")}})' "$KV_TITLE" || true)"
if [[ -z "$KV_ID" ]]; then
  CREATE_KV="$("${WRANGLER[@]}" kv namespace create "$KV_TITLE" 2>&1 || true)"
  echo "$CREATE_KV"
  KV_ID="$(printf '%s' "$CREATE_KV" | grep -oE '[0-9a-f]{32}' | head -n1 || true)"
fi
if [[ -n "$KV_ID" ]]; then
  node - "$WRANGLER_TOML" "$KV_ID" <<'NODE'
const fs = require("fs");
const [file, id] = process.argv.slice(2);
let t = fs.readFileSync(file, "utf8");
t = t.replace(/(\[\[kv_namespaces\]\][^\[]*?id\s*=\s*)"[^"]*"/s, `$1"${id}"`);
fs.writeFileSync(file, t);
NODE
  ok "KV namespace id: $KV_ID"
else
  warn "Could not provision KV namespace; continuing without cache binding."
fi

# --- 6. migrations ----------------------------------------------------------
log "Applying D1 migrations (remote)"
"${WRANGLER[@]}" d1 migrations apply "$DB_NAME" --remote
ok "Schema up to date"

# --- 7. Pages project -------------------------------------------------------
log "Ensuring Pages project '$PROJECT'"
"${WRANGLER[@]}" pages project create "$PROJECT" --production-branch "$BRANCH" 2>/dev/null \
  && ok "Created Pages project '$PROJECT'" \
  || warn "Pages project '$PROJECT' already exists (or creation skipped)"

# --- 8. secrets -------------------------------------------------------------
log "Syncing secrets present in the environment"
SECRET_NAMES=(
  ELEVENLABS_API_KEY ELEVENLABS_VOICE_HE ELEVENLABS_VOICE_FR ELEVENLABS_VOICE_EN
  DENTAL_PMS_BASE_URL DENTAL_PMS_API_KEY DENTAL_PMS_PROVIDER_ID DENTAL_PMS_OPERATORY_ID
  TELEPHONY_PHONE_NUMBER SEED_TOKEN
)
for name in "${SECRET_NAMES[@]}"; do
  value="${!name:-}"
  if [[ -n "$value" ]]; then
    printf '%s' "$value" | "${WRANGLER[@]}" pages secret put "$name" --project-name "$PROJECT" >/dev/null
    ok "secret set: $name"
  fi
done

# --- 9. deploy --------------------------------------------------------------
log "Deploying to Cloudflare Pages"
DEPLOY_OUT="$("${WRANGLER[@]}" pages deploy dist --project-name "$PROJECT" --branch "$BRANCH" 2>&1)"
echo "$DEPLOY_OUT"
URL="$(printf '%s' "$DEPLOY_OUT" | grep -oE 'https://[a-zA-Z0-9.-]+\.pages\.dev' | head -n1 || true)"
[[ -n "$URL" ]] && ok "Deployed: $URL" || ok "Deployed."

# --- 10. optional seed ------------------------------------------------------
if [[ "$DO_SEED" -eq 1 ]]; then
  log "Seeding demo call records into D1"
  SEED_URL="${URL:-}"
  if [[ -n "$SEED_URL" ]]; then
    curl -fsS -X POST "$SEED_URL/api/seed" \
      ${SEED_TOKEN:+-H "x-seed-token: $SEED_TOKEN"} \
      && ok "Seeded via $SEED_URL/api/seed" \
      || warn "Seed request failed (store may already be populated)."
  else
    warn "No deploy URL captured; skipping seed. Seed later with a POST to /api/seed."
  fi
fi

ok "Cloudflare deployment complete."
