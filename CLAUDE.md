# BizOS – Development Rules

Read this before touching any code. These rules are non-negotiable.

---

## Go Backend (`services/api/`)

### Module File Layout

Every module — core or paid — follows this exact structure:

```
internal/
  core/                          ← always-on module
    models/
      models.go                  ← GORM structs ONLY. No logic.
    dto.go                       ← Request + response types. No logic.
    <domain>_service.go          ← Business logic. One struct per domain.
    handler.go                   ← HTTP handlers. Thin: call service → return response.
    routes.go                    ← Route registration ONLY. No logic.
    <domain>_service_test.go     ← Unit tests alongside the service they test.

  modules/
    invoices/
      models/
        models.go
      dto.go
      service.go
      handler.go
      routes.go
      service_test.go
    inventory/
      ...same pattern...
```

### Hard Rules

- **Separation**: Handlers never contain business logic. Services never touch `echo.Context`.
- **Multi-tenancy**: `businessID` comes from JWT claims only — never from request body or URL params.
- **Permissions**: Every non-public route gets `RequirePermission("module:resource:action")`. No exceptions.
- **Database**: GORM everywhere. Raw SQL only for aggregation/summary queries, and only in services.
- **No SQL files**: GORM AutoMigrate only. Never create `.sql` schema files.
- **Validation**: All request structs use `go-playground/validator/v10` tags. Bind + Validate on every POST/PATCH.
- **Errors**: Always return `response.Error(c, http.StatusXxx, "message", "ERROR_CODE")`. Never `c.JSON` naked.
- **Tests**: Unit tests on every service function. Test the service layer directly — no HTTP testing in unit tests.

### New Module Checklist

When adding a new paid module (e.g. inventory):
1. `internal/modules/<name>/models/models.go` — GORM models
2. `internal/modules/<name>/dto.go` — request/response types
3. `internal/modules/<name>/service.go` — business logic
4. `internal/modules/<name>/handler.go` — HTTP handlers
5. `internal/modules/<name>/routes.go` — register routes, apply `RequireModule("<name>")` to the group
6. `internal/db/db.go` — add models to AutoMigrate list
7. `internal/db/seed.go` — add permissions for the module
8. `internal/server/server.go` — call `<name>.Register(api, db)`

---

## Next.js Frontend (`apps/web/`, `apps/admin/`)

### Directory Structure

```
app/
  (auth)/                        ← Unauthenticated: login, register, forgot-password
    login/page.tsx
    register/page.tsx
  (dashboard)/                   ← Protected pages (require auth)
    layout.tsx                   ← Sidebar + TopBar shell
    page.tsx                     ← Dashboard home
    customers/page.tsx
    sales/page.tsx
    invoices/page.tsx
    expenses/page.tsx
  layout.tsx                     ← Root layout: providers, fonts, toaster
  globals.css                    ← Theme variables ONLY. No component styles here.

components/
  ui/                            ← shadcn primitives. NEVER hand-edit these files.
  layout/
    app-sidebar.tsx
    top-bar.tsx
    mobile-nav.tsx
  features/                      ← Feature-specific components (CustomerCard, InvoiceTable…)
    customers/
    invoices/
    sales/
  shared/
    spinner.tsx                  ← THE loading spinner. Use everywhere. Never duplicate.
    page-loader.tsx              ← Full-page loading overlay.
    empty-state.tsx              ← Empty list state.
    page-header.tsx              ← Page title + action button slot.
    error-boundary.tsx

store/                           ← Zustand stores. One file per domain.
  auth.ts
  ui.ts                          ← Sidebar open/close, theme
  customers.ts
  ...

hooks/                           ← Custom React hooks (useDebounce, useMediaQuery…)

lib/
  api.ts                         ← Axios instance + all typed API functions. No fetch elsewhere.
  utils.ts                       ← cn() and other pure helpers.

types/
  api.ts                         ← API response types mirroring Go DTOs.
  index.ts
```

### Hard Rules

- **`components/ui/`** is owned by shadcn. Never edit files there manually.
- **One component per file**. Named export matching the filename.
- **State**: Zustand for anything shared across components. `useState` for local UI state only.
- **API calls**: Always through `lib/api.ts`. Never `fetch()` or `axios` directly in components or pages.
- **Loading**: Use `<Spinner />` or `<PageLoader />` from `components/shared/`. Never write a one-off spinner.
- **Toast**: `sonner` for all feedback. Every mutation (create/update/delete) shows success or error toast.
- **No inline styles**. Tailwind classes only.
- **Package manager**: `pnpm` only. Never `npm install` or `yarn add`.
- **Forms**: `react-hook-form` + `zod` on every form. No uncontrolled inputs.
- **Imports**: Use `@/*` alias. Never relative `../../` beyond one level.

### Theme

Three modes: `light` (warm cream + green), `dark` (deep navy + green), system default.
Toggle lives in the TopBar. Persisted via `next-themes`.
Do not add a fourth theme without product approval.

---

## Running the Frontend

```bash
cd apps/web
pnpm dev        # starts on http://localhost:3000 (4 GB Node heap — needed for Turbopack)
pnpm build      # production build
pnpm exec tsc --noEmit  # type check without building
```

The `pnpm dev` script uses `cross-env NODE_OPTIONS=--max-old-space-size=4096` because Turbopack (default in Next.js 16) requires 4 GB heap to compile the full app. Do not remove this — the dev server OOMs without it.

## Monorepo

- Root `pnpm-workspace.yaml` lists `apps/*` and `services/*` (for any Node services).
- Shared code lives in `packages/` (types, config). Not created yet — add when genuinely needed.
- `turbo.json` defines pipeline: `build` depends on upstream `build`; `dev` runs all in parallel.

## Security

- Never log JWT tokens, passwords, or PII.
- All API routes validate auth before any DB query.
- Business data is always scoped by `businessID` from JWT — never trust client-supplied tenant ID.
- Secrets live in `.env` files only. Never hardcode. `.env` is in `.gitignore`.

## Conventions

- Money: always `float64` in Go, always `number` in TypeScript. Always carry a `currency` field alongside.
- Dates: RFC 3339 on the wire (`"2026-06-03T00:00:00Z"`). Display formatting happens in the UI.
- IDs: UUID v4 everywhere. Never auto-increment integers as public IDs.
- Error codes: `SCREAMING_SNAKE_CASE` (e.g. `INVOICE_NOT_FOUND`).
