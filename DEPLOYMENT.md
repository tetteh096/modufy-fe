# Modufy — Deployment Guide

How production is wired today and how to redeploy. Use this when onboarding a machine or moving hosts later.

---

## Architecture

| Piece | Host | URL (current) |
|-------|------|----------------|
| Marketing site | Vercel (`apps/www`) | https://modufy-mart.vercel.app |
| Product app | Vercel (`apps/web`) | https://modufy-web.vercel.app |
| Platform admin | Vercel (`apps/admin`) | https://modufy-admin.vercel.app |
| Go API | Heroku (`modufy-api`) | https://modufy-api-b709351248ad.herokuapp.com |
| Postgres | Heroku Postgres addon | `DATABASE_URL` (shared by API + Better Auth on Vercel) |
| File storage | Cloudflare R2 bucket `modufy` | Public: `https://pub-09b22b1c0ebe478ca4ff977e124040fc.r2.dev` |

**Auth:** Better Auth runs in the Next.js apps (web + admin). They mint JWTs for the Go API using the shared `BETTER_AUTH_SECRET`.

**Repos:** Two git remotes / projects:

- Frontend monorepo → GitHub `modufy-fe` (this workspace root; `/services` is gitignored here)
- API → GitHub `modufy-be` (lives in `services/api` as its own git repo)

---

## Prerequisites

- Heroku CLI logged in (`heroku auth:whoami`)
- Docker Desktop (only needed for CLI image pushes, not for git+container deploy)
- Access to Vercel projects: `modufy-web`, `modufy-admin`, `modufy-mart`
- Cloudflare R2 API token (S3-compatible access key + secret) — not a `cfat_` Account API token

---

## Secrets (never commit)

Local files:

| File | Purpose |
|------|---------|
| `services/api/.env` | Local Docker Postgres + MinIO |
| `services/api/.env.production` | Copy-paste source for Heroku Config Vars (gitignored) |

Generate signing secrets (example):

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

**Must match across API + web + admin:**

- `BETTER_AUTH_SECRET`

**API production only:**

- `ENCRYPTION_KEY` (required when `ENVIRONMENT=production`)

---

## 1. Cloudflare R2 (files)

Bucket: `modufy`

| Env (Heroku API) | Value |
|------------------|--------|
| `STORAGE_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` (no `/modufy` suffix) |
| `STORAGE_ACCESS_KEY` | R2 Access Key ID |
| `STORAGE_SECRET_KEY` | R2 Secret Access Key |
| `STORAGE_BUCKET` | `modufy` |
| `STORAGE_REGION` | `auto` |
| `STORAGE_PUBLIC_URL` | Public Development URL or custom domain |

Also set on Vercel web:

- `NEXT_PUBLIC_STORAGE_URL` = same as `STORAGE_PUBLIC_URL`

Public Development URL is fine for launch; add a custom domain later for production traffic.

---

## 2. Heroku API (`modufy-api`)

### App facts

- App name: `modufy-api`
- Stack: **container** (Dockerfile, not Go buildpack)
- Addon: `heroku-postgresql:essential-0`
- Git remote (from `services/api`): `heroku` → `https://git.heroku.com/modufy-api.git`

### Required config vars

Set with `heroku config:set -a modufy-api ...` or Dashboard → Settings → Config Vars.

| Key | Notes |
|-----|--------|
| `DATABASE_URL` | Set by Postgres addon — do not invent |
| `ENVIRONMENT` | `production` |
| `SWAGGER_ENABLED` | `false` |
| `BETTER_AUTH_SECRET` | Shared with Vercel |
| `ENCRYPTION_KEY` | Distinct from auth secret |
| `FRONTEND_URL` | `https://modufy-web.vercel.app` |
| `CORS_ORIGINS` | `https://modufy-admin.vercel.app` (comma-separated extras) |
| `API_PUBLIC_URL` | `https://modufy-api-b709351248ad.herokuapp.com` |
| `STORAGE_*` | See R2 section |
| `PAYSTACK_*` | Test or live keys |
| `RESEND_API_KEY` / `RESEND_FROM` | Auth + notification email |
| `SMS_PROVIDER` | `arkesel` |
| `SMS_SANDBOX` | `false` in prod |
| `ARKESEL_SENDER_ID` | Optional; keys often set in Admin → Integrations |

### Deploy option A — Git + container (preferred going forward)

From the **API repo** (`services/api` = `modufy-be`):

```powershell
cd services/api
git add .
git commit -m "Your message"
.\deploy-heroku.ps1
# equivalent: git push heroku main
```

Heroku reads `heroku.yml` → builds `Dockerfile` → releases `web`.

Script refuses a dirty working tree — commit or stash first.

### Deploy option B — Docker from this machine

```powershell
cd services/api
heroku container:login
docker buildx build --platform linux/amd64 --provenance=false --sbom=false `
  -t registry.heroku.com/modufy-api/web:latest --load .
docker push registry.heroku.com/modufy-api/web:latest
heroku container:release web -a modufy-api
```

Notes:

- Dockerfile generates Swagger `docs/` during build (`docs/` is gitignored locally).
- Heroku registry rejects multi-arch attestations — use `--provenance=false --sbom=false`.

### Useful commands

```powershell
heroku logs --tail -a modufy-api
heroku ps -a modufy-api
heroku config -a modufy-api
heroku config:get DATABASE_URL -a modufy-api
heroku restart -a modufy-api
```

---

## 3. Vercel frontends

Three projects from `modufy-fe`, each with its **Root Directory** set:

| Vercel project | Root Directory |
|----------------|----------------|
| modufy-web | `apps/web` |
| modufy-admin | `apps/admin` |
| modufy-mart | `apps/www` |

### Shared / per-app env (Production)

**Both web and admin:**

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Same Heroku Postgres URL (**plain** — do **not** append `?sslmode=require`) |
| `BETTER_AUTH_SECRET` | Same as Heroku API |
| `NEXT_PUBLIC_API_URL` | `https://modufy-api-b709351248ad.herokuapp.com/api/v1` |
| `NEXT_PUBLIC_STORAGE_URL` | R2 public base URL |

**web only:**

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_APP_URL` | `https://modufy-web.vercel.app` |
| `RESEND_API_KEY` / `RESEND_FROM` | If auth emails send from Next |

**admin only:**

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_APP_URL` | `https://modufy-admin.vercel.app` |

**www (marketing):**

| Key | Value |
|-----|--------|
| `NEXT_PUBLIC_APP_URL` | `https://modufy-web.vercel.app` (Sign in / Sign up targets) |
| `NEXT_PUBLIC_SITE_URL` | `https://modufy-mart.vercel.app` |

After changing env vars: **Redeploy** the project (Deployments → ⋯ → Redeploy).

---

## 4. First super admin

API migrations run on boot. Demo seed may skip if no demo user exists — that is normal.

Create platform admin against **production** DB:

```powershell
cd services/api
$env:DATABASE_URL = "<heroku DATABASE_URL>?sslmode=require"
go run ./cmd/superadmin
```

Default bootstrap credentials (change after first login):

- Email: `admin@gmail.com`
- Password: `admin123@`
- Login: https://modufy-admin.vercel.app/login

The script assigns `super_admin` by **role name** (seeded role UUIDs can differ per environment).

Arkesel keys: prefer **Admin → Settings → Integrations** after admin works (encrypted in DB). Optional env fallback: `ARKESEL_API_KEY`.

---

## 5. Known gotchas (fix once)

### Node `pg` + Heroku SSL

Recent `pg` treats `sslmode=require` in the URL like full cert verify and fails with `unable to get local issuer certificate`.

Apps use `lib/pg.ts`: strip `sslmode` from the DSN, set `ssl: { rejectUnauthorized: false }` for remote DBs.  
**Vercel `DATABASE_URL` must stay plain** (no `?sslmode=...`).

### Better Auth + 2FA plugin (web)

Web enables the two-factor plugin. DB needs:

- `"user"."twoFactorEnabled"` boolean
- `"twoFactor"` table

If missing, sign-up returns `422 FAILED_TO_CREATE_USER`. Create those columns/tables (or ensure Better Auth migrations run) on any new Postgres.

### Admin token `403`

`/api/auth/token` requires the Go `users` row to have role `super_admin`.  
If login works but token/dashboard fails: re-run `cmd/superadmin` or assign the role by name in SQL.

---

## 6. Redeploy checklist

**API change**

1. Commit in `services/api`
2. `.\deploy-heroku.ps1` (or Docker push/release)
3. Check `heroku logs -a modufy-api`

**Frontend change**

1. Push `modufy-fe` → Vercel auto-builds  
2. Or Redeploy from Vercel UI after env-only changes

**Smoke test**

1. https://modufy-admin.vercel.app/login  
2. https://modufy-web.vercel.app/register or /login  
3. Upload (R2) if storage changed  
4. Marketing Sign in / Sign up → web app URLs  

---

## 7. Moving off Heroku later

Heroku today = **API process + Postgres**. R2 and Vercel stay.

Typical cutover:

1. Provision new Postgres; `pg_dump` / `pg_restore` from Heroku  
2. Deploy API elsewhere (Fly / Render / DO / AWS) with same env vars  
3. Point Vercel `DATABASE_URL` + `NEXT_PUBLIC_API_URL` at the new stack  
4. Update `API_PUBLIC_URL`, CORS, Paystack/Resend/Arkesel webhooks  
5. Dry-run restore on staging before cutting DNS/traffic  

Application data lives in **Postgres**; uploaded media lives in **R2**.

---

## Quick reference URLs

```
API:     https://modufy-api-b709351248ad.herokuapp.com
Web:     https://modufy-web.vercel.app
Admin:   https://modufy-admin.vercel.app
WWW:     https://modufy-mart.vercel.app
R2 pub:  https://pub-09b22b1c0ebe478ca4ff977e124040fc.r2.dev
```
