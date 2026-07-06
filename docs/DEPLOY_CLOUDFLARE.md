# Deploying Ask-Yael to Cloudflare

Ask-Yael deploys as a **Cloudflare Pages** app with everything wired in:

| Piece | Cloudflare product | What it does |
| --- | --- | --- |
| Static SPA (`dist/`) | **Pages** | The marketing site + `/admin` dashboard |
| API (`functions/`) | **Pages Functions** (Workers) | `/api/*` endpoints |
| Call store | **D1** (SQLite) | Persists every handled call (`migrations/`) |
| Edge cache | **KV** | Optional cache binding (`CACHE`) |
| Voice / PMS / telephony creds | **Secrets** | Encrypted, set per project |

One script provisions and deploys all of it:

```bash
npm run cf:deploy          # build + provision + migrate + deploy
npm run cf:deploy:seed     # …and seed the demo call records
```

## Prerequisites

- A Cloudflare account.
- For CI / non-interactive runs, export a scoped API token and account id:
  ```bash
  export CLOUDFLARE_API_TOKEN=…   # Pages:Edit, D1:Edit, Workers KV:Edit
  export CLOUDFLARE_ACCOUNT_ID=…
  ```
  Locally you can instead run `npx wrangler login`.

## What `scripts/deploy-cloudflare.sh` does

The script is **idempotent** — run it as many times as you like. It:

1. Installs dependencies (`npm ci`).
2. Runs the test suite (skip with `--skip-tests`).
3. Builds the static site to `dist/` (skip with `--skip-build`).
4. Ensures the **D1 database** exists, creating it if needed, and writes its
   `database_id` into `wrangler.toml`.
5. Ensures the **KV namespace** exists and writes its `id` into `wrangler.toml`.
6. Applies **D1 migrations** (`migrations/`) to the remote database.
7. Ensures the **Pages project** exists.
8. Pushes any **secrets** found in the environment (see below).
9. **Deploys** `dist/` to Pages and prints the URL.
10. Optionally **seeds** demo data (`--seed`).

### Options

```
--project NAME   Pages project name        (default: ask-yael)
--db NAME        D1 database name          (default: ask-yael-db)
--kv NAME        KV namespace title        (default: ask-yael-cache)
--branch NAME    Production branch         (default: main)
--seed           Seed demo call records after deploy
--skip-tests     Skip `npm test`
--skip-build     Reuse an existing ./dist
```

### Secrets

Any of these present in the environment are pushed as encrypted Pages secrets
(they are **never** committed — `wrangler.toml` holds only non-secret vars):

```
ELEVENLABS_API_KEY ELEVENLABS_VOICE_HE ELEVENLABS_VOICE_FR ELEVENLABS_VOICE_EN
DENTAL_PMS_BASE_URL DENTAL_PMS_API_KEY DENTAL_PMS_PROVIDER_ID DENTAL_PMS_OPERATORY_ID
TELEPHONY_PHONE_NUMBER SEED_TOKEN
```

These map onto the engine's live wiring (`src/engine/config/liveConfig.js`).

## The API

All endpoints live under `/api` (CORS-enabled, JSON):

| Method & path | Purpose |
| --- | --- |
| `GET /api/health` | Liveness + D1 connectivity probe |
| `GET /api/calls?limit=N` | Newest-first call records (dashboard call log) |
| `POST /api/calls` | Ingest a call record (or array) — the telephony worker calls this after each live call. Idempotent upsert by `id`. |
| `GET /api/summary` | Overview analytics (engine `summarize`) |
| `GET /api/appointments` | Upcoming appointments (engine `upcomingAppointments`) |
| `POST /api/seed` | Seed demo records — allowed on an empty store, or with a matching `x-seed-token` |

The Functions are thin I/O shells; all row⇆record shaping is the pure,
unit-tested `src/engine/store/d1Store.js`, and analytics reuse the engine's
existing aggregators. The `/admin` dashboard reads `/api/calls` and falls back
to demo data when the API is unavailable.

## Local development against real bindings

```bash
cp .dev.vars.example .dev.vars          # fill in local secrets (gitignored)
npm run build                           # produce dist/
npm run cf:migrate:local                # create the local D1 schema
npx wrangler pages dev dist             # serve SPA + Functions + local D1/KV
```

Then exercise it:

```bash
curl -s localhost:8788/api/health
curl -s -X POST localhost:8788/api/seed
curl -s 'localhost:8788/api/calls?limit=5'
curl -s localhost:8788/api/summary
```

## Migrations

Schema lives in `migrations/`. Apply remotely with `npm run cf:migrate` (or
locally with `npm run cf:migrate:local`). The `calls` table columns are the
single source of truth in `src/engine/store/d1Store.js` (`CALL_COLUMNS`) — keep
the two in sync when evolving the schema.
