# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Community-based climbing app to create and share topos (climbing route guides) for free. Built as an npm workspace monorepo:

- `apps/pwa` — React/TypeScript/Vite frontend (PWA)
- `apps/api` — Express/TypeScript backend (placeholder — see Architecture)

**Backend strategy:** Supabase is the backend (Backend-as-a-Service). The PWA talks directly to Supabase for auth, CRUD, and storage; authorization is enforced via Postgres RLS, not application code. Auth is handled entirely by Supabase Auth — there are no custom auth endpoints. A custom server (`apps/api` or a Supabase Edge Function) is reserved only for work that needs secret keys or heavy compute — currently just the planned image→AI→topo pipeline.

## Development Commands

All commands run from the repo root (`dirtbags-united/`):

```bash
npm run dev:pwa     # Start frontend (Vite dev server)
npm run dev:api     # Start backend (nodemon + tsx)
npm run dev         # Alias for dev:pwa
```

From `apps/pwa/`:

```bash
npm run build       # tsc + vite build
npm run lint        # eslint
npm run preview     # Preview production build
```

No test runner is configured yet (`test` scripts just echo an error).

## Architecture

### Frontend (`apps/pwa`)

React 19 SPA with React Router v7. The main layout in `src/App.tsx` wraps all routes inside a fixed-height column: a scrollable content area with a persistent `<Navbar>` at the bottom.

**Routing:**

- `/` → `MapPage` (main feature)
- `/logbook`, `/favorites`, `/profile` → stub pages
- `/styleguide` → component showcase at `StylePage`
- `/admin` - admin page to verify requests, check uploads etc.

**Map stack:** MapLibre GL via `maplibre-react-components` (`RMap`, `RGradientMarker`, `RPopup`). The map style uses the OpenMapTiles public endpoint. Marker click state is local (`useState` in `MapLibre.tsx`). Crags are fetched live from Supabase in `MapPage.tsx` (`supabase.from("crags").select("*, routes(*)")`) and passed to `MapLibre`.

**Supabase:** Typed client (`createClient<Database>`) is initialized in `apps/pwa/src/utils/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` env vars (see `apps/pwa/.env`). Used in `MapPage` to load crags+routes.

**Domain models** live in `src/domain/`:

- `Crag` — climbing area with lat/lng and optional parking coords
- `Sector` — sub-area within a crag
- `Route` — individual climb with grade and optional sector
- `Tick` — a logged ascent with tick type (`Rotpunkt`, `Flash`, `Onsight`, `Toprope`, `Go`)

`src/domain/database.types.ts` holds the Supabase-generated DB types. `src/services/` maps DB rows (snake_case) to domain models (camelCase) — e.g. `mapCragFromDatabaseRow`, `mapRouteFromDatabaseRow`. Keep these mappers in sync when the schema changes.

**Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed). Uses the stone color palette throughout.

### Backend (`apps/api`)

Currently a placeholder: a minimal Express 5 server at `src/index.ts` with only a root `GET /` route (returns "Hello, world!"). Listens on `PORT` env var or 8000. ES modules (`"type": "module"`), runs via `tsx` + `nodemon` in dev. Not used by the app yet. When the image→AI→topo pipeline is built, decide between an Express worker here vs. a Supabase Edge Function (prefer Edge Function unless the job needs long runtimes/queues). Any server only ever *verifies* the Supabase-issued JWT — it never issues auth.

#### Auth

Handled entirely by Supabase Auth (JWT, sessions, password hashing, OAuth) via `supabase-js` in the PWA — no custom auth endpoints. Authorization is enforced by Postgres RLS keyed on `auth.uid()`.

### Database

Supabase Postgres, schema managed via migrations in `supabase/migrations/`. Existing tables: `crags`, `routes` — both with RLS enabled (public SELECT policies), `created_by` referencing `auth.users`, `updated_at` triggers (moddatetime) and indexes. No write (INSERT/UPDATE/DELETE) policies yet, so writes are currently blocked by RLS. Tables still missing: `sectors` (referenced by `routes.sector_id`), `ticks`, `favorites`, `profiles`. Rate-limiting target: ~100 req/min (low-effort servers).

## Key Conventions

- Tailwind v4 is configured entirely via the Vite plugin — no config file.
- The `maplibre-gl` CSS import is commented out in `MapLibre.tsx`; `maplibre-theme` CSS is used instead.
- `gradientMarkerPopupOffset` from `maplibre-react-components` must be passed to `RPopup` when anchoring to an `RGradientMarker`.
- The `packages/` workspace exists but contains only a root `package.json` — no shared packages yet.

## Claude Code instructions

- Keep answers short and simple
- dont show changed code in the CLI to save tokens
- dont make big code changes, one function at a time
