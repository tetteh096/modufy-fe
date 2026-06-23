# Modufy — Frontend

Two Next.js apps in one repository:

- **`apps/web`** — customer/business app
- **`apps/admin`** — platform admin console (dev port 3001)

Each app is standalone (its own `pnpm-lock.yaml`, no workspace dependencies).

## Local development

```bash
cd apps/web   # or apps/admin
pnpm install
pnpm dev
```

`pnpm dev` runs with a 4 GB Node heap (`cross-env NODE_OPTIONS=--max-old-space-size=4096`) because Turbopack (Next.js 16) needs it.

## Build

```bash
cd apps/web   # or apps/admin
pnpm build
pnpm exec tsc --noEmit   # type check only
```

## Vercel deployment

Both apps deploy from this single repo as **two separate Vercel projects**:

| Vercel project | Root Directory | Framework |
|----------------|----------------|-----------|
| modufy-web     | `apps/web`     | Next.js   |
| modufy-admin   | `apps/admin`   | Next.js   |

For each project (Settings → General):

1. **Root Directory** → set as above (`apps/web` or `apps/admin`).
2. Framework preset, build command, and install command come from each app's `vercel.json`.
3. Add the app's environment variables (see `apps/web/.env.example`) under Settings → Environment Variables. Never commit `.env.local`.

Pushing to the default branch triggers a production deploy for both projects.
