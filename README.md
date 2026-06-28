# Modufy — Frontend

Three Next.js apps in one repository:

- **`apps/www`** — public marketing site (modufy.app)
- **`apps/web`** — customer/business app (app.modufy.app)
- **`apps/admin`** — platform admin console (dev port 3001)

Each app is standalone (its own `pnpm-lock.yaml`, no workspace dependencies).

## Local development

```bash
cd apps/www   # marketing site (port 3002)
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

Both apps deploy from this single repo as **separate Vercel projects**:

| Vercel project | Root Directory | Framework | Default port |
|----------------|----------------|-----------|--------------|
| modufy-www     | `apps/www`     | Next.js   | 3002         |
| modufy-web     | `apps/web`     | Next.js   | 3000         |
| modufy-admin   | `apps/admin`   | Next.js   | 3001         |

For each project (Settings → General):

1. **Root Directory** → set as above (`apps/web` or `apps/admin`).
2. Framework preset, build command, and install command come from each app's `vercel.json`.
3. Add the app's environment variables (see `apps/web/.env.example`) under Settings → Environment Variables. Never commit `.env.local`.

Pushing to the default branch triggers a production deploy for both projects.
