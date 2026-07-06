# Ask Yael

**About**

Yael is an automated multilingual receptionist (Hebrew / French / English / any
language). The product spec and phased development path (dental → physical
therapy → profession platform) live in [`docs/SPEC.md`](./docs/SPEC.md). The
Phase-0 pure, test-driven conversation engine lives in
[`src/engine`](./src/engine) — run it with `npm test`.

This repository contains the marketing/landing site (React + Vite) and the
framework-agnostic conversation engine. It has no proprietary platform
dependencies and can be hosted on any standard Linux cloud server (or any static
host) after building.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.

## Local development

Run the app:

```
npm run dev
```

Run the conversation-engine tests:

```
npm test
```

## Build & deploy

Produce a static production build:

```
npm run build
```

The build output is written to `dist/`. Serve it with any static file server or
reverse proxy (for example Nginx, Caddy, or `npm run preview` for a quick local
check) on your Linux cloud server.

## Deploy to Cloudflare

For a full Cloudflare deployment — static site on **Pages**, an API on **Pages
Functions**, and a **D1** database as the call store — see
[`docs/DEPLOY_CLOUDFLARE.md`](./docs/DEPLOY_CLOUDFLARE.md). One command does it
all (build, provision the database + KV, apply migrations, set secrets, deploy):

```
npm run cf:deploy
```
